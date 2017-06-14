import path =  require("path");
import { 
  inject,
  Kernel,
  Provider,
  IProvider,
  UpsertBus,
  BrokerBus,
  IDisposable,
  MimeTypeProvider,
  KernelProvider,
  PrivateBusProvider,
} from "aerial-common";
import { ReadableStream } from "mesh";
import { MemoryDataStore } from "mesh-memory-ds";
import { createJavaScriptSandboxProviders } from "aerial-commonjs-extension/lib/sandbox";

import {
  Sandbox,
  FileCache,
  Dependency,
  IFileResolver,
  URIProtocol,
  IDependencyGraph,
  DependencyGraph,
  IDependencyLoader,
  URIProtocolProvider,
  FileCacheProvider,
  createSandboxProviders,
  IResolvedDependencyInfo,
  IDependencyLoaderResult,
  DependencyGraphProvider,
  ProtocolURLResolverProvider,
  DependencyGraphStrategyProvider,
  IDependencyGraphStrategyOptions,
} from "../..";

export interface IMockFiles {
  [Identifier: string]: string;
}

export class MockFilesProvider extends Provider<IMockFiles> {
  static readonly ID = "mockFiles";
  constructor(files: IMockFiles) {
    super(MockFilesProvider.ID, files);
  }
}

export interface ISandboxTestProviderOptions {
  mockFiles?: IMockFiles;
  providers?: IProvider[];
  fileCacheSync?: boolean;
}

export class MockFileURIProtocol extends URIProtocol {

  @inject(MockFilesProvider.ID)
  private _mockFiles: IMockFiles;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  private _watchers2: any;

  constructor() {
    super();
    this._watchers2 = {};
  }

  fileExists(filePath: string): Promise<boolean> {
    return Promise.resolve(!!this._mockFiles[this.removeProtocol(filePath)]);
  }

  read(uri: string): Promise<any> {
    const filePath = this.removeProtocol(uri);

    // try removing root if not found initially
    const content = this._mockFiles[filePath] || this._mockFiles[filePath.substr(1)];

    return new Promise((resolve, reject) => {

      // simulated latency
      setTimeout(() => {
        if (content) {
          resolve({ type: MimeTypeProvider.lookup(uri, this._kernel), content: content });
        } else {
          reject(new Error(`Mock file ${uri} not found.`));
        }
      }, 5);
    });
  }
  write(uri: string, content: string): Promise<void> {
    const filePath = this.removeProtocol(uri);

    this._mockFiles[filePath] = content;

    if (this._watchers2[filePath]) {
      this._watchers2[filePath]();
    }

    return Promise.resolve();
  }
  watch2(uri: string, onChange: Function): IDisposable {
    const filePath = this.removeProtocol(uri);
    this._watchers2[filePath] = onChange;
    return {
      dispose: () => {
        this._watchers2[filePath] = undefined;
      }
    }
  }
}

export class MockFileResolver implements IFileResolver {
  @inject(MockFilesProvider.ID)
  private _mockFiles: IMockFiles;

  resolve(relativePath: string, origin: string) {

    // http url or something other than file
    if (/^\w+:\/\//.test(relativePath) && relativePath.indexOf("file://") !== 0) {
      return Promise.resolve(relativePath);
    }
    relativePath = relativePath.replace("file://", "");
    return Promise.resolve([
      path.resolve(origin || "", relativePath),
      path.join("", relativePath)
    ].find(filePath => !!this._mockFiles[filePath]));
  }
}

export const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const createTestSandboxProviders = (options: ISandboxTestProviderOptions = {}) => {
  return [
    new MockFilesProvider(options.mockFiles || {}),
    createSandboxProviders(MockFileResolver),
    new URIProtocolProvider("file", MockFileURIProtocol, Infinity)
  ];
}

export const createSandboxTestKernel = (options: ISandboxTestProviderOptions = {}) => {
  const kernel = new Kernel();
  const bus = new BrokerBus();
  bus.register(new UpsertBus(new MemoryDataStore()));

  kernel.register(
    options.providers || [],
    new KernelProvider(),
    new PrivateBusProvider(bus),
    createJavaScriptSandboxProviders(),
    createTestSandboxProviders(options)
  );

  if (options.fileCacheSync !== false) {
    FileCacheProvider.getInstance(kernel).syncWithLocalFiles();
  }

  return kernel;
}

export const createTestDependencyGraph = (graphOptions: IDependencyGraphStrategyOptions, kernelOptions: ISandboxTestProviderOptions) => {
  const kernel = createSandboxTestKernel(kernelOptions);
  return DependencyGraphProvider.getInstance(graphOptions, kernel);
}

export const evaluateDependency = async (dependency: Dependency) => {
  const sandbox = new Sandbox(dependency["_kernel"]);
  await sandbox.open(dependency);
  return sandbox.exports;
}