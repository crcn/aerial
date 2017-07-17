// A bit of a cluster fuck this is. Needs cleaning after many of mysteries
// around webpack are resolved.
import {
  inject,
  Logger,
  loggable,
  Kernel,
  JS_MIME_TYPE,
  KernelProvider,
  ApplicationConfigurationProvider,
} from "aerial-common";

import md5 =  require("md5");
import fs =  require("fs");
import nodeLibs = require("node-libs-browser");
import detective =  require("detective");

// TODO - handle __webpack_public_path__
import sm = require("source-map");

import { 
  IModule,
  Dependency, 
  NodeModuleResolver,
  IDependencyContent,
  FileCacheProvider,
  IDependencyLoader,
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
  IDependencyGraphStrategy,
} from "aerial-sandbox";

import path =  require("path");

import resolveNodeModule =  require("resolve");

// https://webpack.github.io/docs/configuration.html
// internal APIs

export interface IWebpackLoaderConfig {

  // file name test
  test: RegExp|((uri:string) => boolean);

  // whitelist
  include: string[];

  // blacklist
  exclude: string[];

  // dependency loader
  loader?: string;
  loaders?: IWebpackLoaderConfig[];
}

export interface INormalizedWebpackLoaderConfig {
  modulePath: string;
  query: string;
}

export interface IWebpackLoaderOptions {
  disablePreloaders?: boolean;
  disableAllLoaders?: boolean;
  loaders: INormalizedWebpackLoaderConfig[]
}

export interface IWebpackResolveAliasConfig {
  [Idenfifier: string]: string;
}

export interface IWebpackResolveConfig {
  root?: string;
  alias?: IWebpackResolveAliasConfig;
  extensions?: string[];
  modulesDirectories: string[];
}

export interface IWebpackNodeConfig {
  __filename: boolean;
  fs: string;
}

export interface IWebpackTandemConfig {
  setup: (strategy: WebpackDependencyGraphStrategy) => any;
}

export interface IWebpackConfig {
  tandem?: IWebpackTandemConfig;
  entry?: any;
  context: string;
  output?: any;
  node: IWebpackNodeConfig,
  resolve: IWebpackResolveConfig;
  module: {
    preLoaders?: IWebpackLoaderConfig[];
    loaders: IWebpackLoaderConfig[]
    postLoaders?: IWebpackLoaderConfig[];
  }
}

function testLoader(uri: string, loader: IWebpackLoaderConfig) {
  if (!(typeof loader.test === "function" ? loader.test(uri) : (<RegExp>loader.test).test(uri))) return false;
  // more here
  return true;
}

export class MockWebpackCompiler {
  plugin(key: string, callback) { }
}

class WebpackLoaderContextModule {
  readonly meta: any = {};
  readonly errors: any[] = [];
}

@loggable()
class WebpackLoaderContext {

  protected readonly logger: Logger;

  private _async: boolean;
  private _resolve: Function;
  private _reject: Function;
  private _module: WebpackLoaderContextModule;
  readonly loaderIndex: number;
  readonly options: any;
  private _compiler: MockWebpackCompiler;
  readonly query: string;
  public remainingRequest: string;

  constructor(
    readonly loaders: INormalizedWebpackLoaderConfig[],
    readonly loader: INormalizedWebpackLoaderConfig,
    readonly strategy: WebpackDependencyGraphStrategy,
    readonly resourcePath: string,
    readonly id: string,
    private _dependencies: string[]
  ) {

    this._compiler = strategy.compiler;

    this.query = loader.query;
    this.options = Object.assign({ context: "" }, strategy.config);
    this.loaderIndex = this.loaders.indexOf(loader);
    this._module = new WebpackLoaderContextModule();

    this.remainingRequest = this.loaderIndex === this.loaders.length - 1 ? this.resourcePath : undefined;
  }

  emitWarning() {

  }

  get includedDependencyUris(): string[] {
    return this._dependencies;
  }

  private get module() {
    return require(this.loader.modulePath);
  }

  async load(content, map): Promise<{ content: string, map: any }> {
    return new Promise<any>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      const result = this.module.call(this, this.module.raw ? content : String(content), map);
      if (!this._async) {
        return resolve(result && { content: result });
      }
    })
  }

  capture() {
    const module = this.module;
    if (!module.pitch) return;

    const remainingRequests = this.loaders.slice(this.loaderIndex + 1).map((loader) => {
      return loader.modulePath + (loader.query || "")
    });

    remainingRequests.push(this.resourcePath);
    const result = module.pitch(remainingRequests.join("!"));
    if (result == null) return;

    return { content: result, map: undefined }
  }

  async emitFile(fileName: string, content: string) {
    const uri = "webpack://" + fileName;
    // this.addDependency(uri);
    this.logger.debug(`Emitting asset ${fileName}`);
    const fileCache = FileCacheProvider.getInstance(this.strategy.kernel);
    await fileCache.save(uri, { content });
  }

  async() {
    this._async = true;
    return (err, content, map: sm.RawSourceMap) => {
      if (err) return this._reject(err);

      // change sources to absolute path for edits
      if (map) {
        map.sources = map.sources.map(relativePath => {
          return relativePath.charAt(0) !== "/" ? path.join(this.strategy.config.context || process.cwd(), relativePath) : relativePath;
        });
      }
      this._resolve({ content, map });
    }
  }

  cacheable() {

  }

  clearProviders() {
    this._dependencies = [];
  }

  addDependency(uri) {
    this._dependencies.push(uri);
  }

  dependency(uri) {
    return this.addDependency(uri);
  }

  resolve(cwd: string, relativePath: string, callback: (err, result?) => any) {
    this.strategy.resolve(relativePath, cwd).then((info) => {
      callback(null, info.uri && info.uri.replace("file://", ""));
    }).catch(callback);
  }
}

@loggable()
class WebpackDependencyLoader implements IDependencyLoader {
  protected readonly logger: Logger;
  constructor(readonly strategy: WebpackDependencyGraphStrategy, readonly options: IWebpackLoaderOptions) { }
  async load({ uri, hash }: IResolvedDependencyInfo, { type, content, map }: IDependencyContent): Promise<IDependencyLoaderResult> {
    this.logger.debug("Loading", uri);

    const { config } = this.strategy;

    // find the matching loaders
    const usableConfigLoaders: IWebpackLoaderConfig[] = [];

    if (!this.options.disableAllLoaders) {
      if (!this.options.disablePreloaders) usableConfigLoaders.push(...(config.module.preLoaders || []));
      usableConfigLoaders.push(...config.module.loaders, ...(config.module.postLoaders || []));
    }

    const moduleLoaders = [
      ...normalizeConfigLoaders(...usableConfigLoaders.filter(testLoader.bind(this, uri))),
      ...(this.options.loaders || [])
    ]

    const includedDependencyUris = [];

    const contexts = moduleLoaders.map((loader) => {
      return this.strategy.kernel.inject(new WebpackLoaderContext(
        moduleLoaders,
        loader,
        this.strategy,
        uri,
        hash,
        includedDependencyUris
      ));
    });

    const loadNext = async (content: string, map: any, index: number = 0): Promise<{ map: any, content: string }> => {
      if (index >= contexts.length) return { content, map };
      const context = contexts[index];
      const result = (await context.capture() || await loadNext(content, map, index + 1));
      return await context.load(result.content, result.map) || result;
    }

    const result = await loadNext(content, map, 0);

    this.logger.debug("loaded", uri);

    const foundProviderPaths = detective(result.content);

    return {
      map: result.map,
      type: JS_MIME_TYPE,
      content: result.content,
      importedDependencyUris: foundProviderPaths,
      includedDependencyUris: includedDependencyUris
    };
  }
}

/**
 */

function normalizeConfigLoaders(...loaders: IWebpackLoaderConfig[]) {
  const normalizedLoaders = [];
  for (const loader of loaders) {
    normalizedLoaders.push(...parserLoaderOptions(loader.loader).loaders);
  }
  return normalizedLoaders;
}

/**
 */

function parserLoaderOptions(moduleInfo: string, hasFile: boolean = false): IWebpackLoaderOptions {


  const loaderParts = moduleInfo.replace(/^(-|!)?!/,"").split("!");
  if (hasFile) loaderParts.pop();
  

  const options: IWebpackLoaderOptions = {
    disablePreloaders: /^-?!/.test(moduleInfo),
    disableAllLoaders: /^(-|!)!/.test(moduleInfo), // !!raw!uri
    loaders: (moduleInfo.length ? loaderParts : []).map((loaderName) => {
      const [moduleName, query] = loaderName.split("?");
      return {
        modulePath: resolveNodeModule.sync(moduleName),
        query: query && "?" + query
      }
    })
  };

  return options;
}

export class WebpackSandboxContext {
  readonly module: WebpackSandboxContext;
  readonly id: string;
  readonly __filename: string;
  readonly __dirname: string;

  constructor(private _target: IModule) {
    this.module = this;
    this.id = _target.source.hash;

    // TODO - need to check webpack config for this.
    this.__filename = _target.source.uri;
    this.__dirname = path.dirname(_target.source.uri);
  }

  get exports() {
    return this._target.exports;
  }

  set exports(value: any) {
    this._target.exports = value;
  }
}

export class WebpackProtocolResolver {
  async resolve(url): Promise<string> {

    // cheap for now. Will need to scan all loaded webpack strategy singletons later
    // on.
    const relativePath = url.replace("webpack://", "");

    return relativePath.charAt(0) === "/" && fs.existsSync(relativePath) ? relativePath : path.join(process.cwd(), relativePath);
  }
}

export class WebpackProtocolHandler {

}

/**
 */

@loggable()
export class WebpackDependencyGraphStrategy implements IDependencyGraphStrategy {

  protected readonly logger: Logger;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  private _resolver: NodeModuleResolver;

  @inject(ApplicationConfigurationProvider.ID)
  private _config: any;

  readonly config: IWebpackConfig;
  readonly compiler: MockWebpackCompiler;
  readonly basedir: string;

  constructor(options: any = {}) {

    const { config } = options;

    if (config && typeof config === "object") {
      this.basedir = process.cwd();
      this.config = config;
    } else {
      this.basedir = config && path.dirname(<string>config) || process.cwd();
      this.config = require(<string>config || path.join(this.basedir, "webpack.config.js"));
    }

    this.compiler = new MockWebpackCompiler();

    // custom config for TD environment.
    if (this.config.tandem && this.config.tandem.setup) {
      this.config.tandem.setup(this);
    }

    this._resolver = new NodeModuleResolver({
      extensions: ["", ...this.config.resolve.extensions],
      directories: [...this.config.resolve.modulesDirectories, this.config.resolve.root, this.basedir]
    });
  }

  get kernel() {
    return this._kernel;
  }

  createGlobalContext() {

    // TODO - this needs to point to the proper registered protocol
    return {
      Buffer: Buffer,
      __webpack_public_path__: "http://" + this._config.hostname + ":" + this._config.port + "/file-cache/" + encodeURIComponent("webpack://"),

      // TODO _ this should be shared by other strategies later on
      process: {
        argv: [],
        version: process.version,
        nextTick: next => setTimeout(next, 0),
        env: process.env,
        cwd: () => process.cwd()
      }
    };
  }

  createModuleContext(module: IModule) {
    return new WebpackSandboxContext(module);
  }

  /**
   * Results the relative file path from the cwd, and provides
   * information about how it should be treared.
   *
   * Examples:
   * const dependencyInfo = resolver.resolve('text!./module.mu');
   * const dependencyInfo = resolver.resolve('template!./module.mu');
   */

  getLoader(options: IWebpackLoaderOptions): IDependencyLoader {
    return this._kernel.inject(new WebpackDependencyLoader(this, options));
  }

  async resolve(moduleInfo: string, cwd: string): Promise<IResolvedDependencyInfo> {

    const { config } = this;

    moduleInfo = config.resolve.alias && config.resolve.alias[moduleInfo] || moduleInfo;

    let loaderOptions = parserLoaderOptions(moduleInfo, true);

    const relativeFilePath = moduleInfo.split("!").pop();
    let resolvedFilePath = relativeFilePath;

    try {

      this.logger.debug(`Resolving ${cwd}:${relativeFilePath} (${moduleInfo})`);

      resolvedFilePath = await this._resolver.resolve(relativeFilePath, cwd);
    } catch(e) {
      this.logger.warn(`Unable to resolve ${relativeFilePath}`);
    }


    const isCore = resolvedFilePath && resolveNodeModule.isCore(resolvedFilePath);

    if (isCore) {
      let type = moduleInfo;
      if (this.config.node) {
        const value = this.config.node[moduleInfo];
        if (this.config.node[moduleInfo] === "empty") {
          type = "empty";
        }
      }
      resolvedFilePath = nodeLibs[type] || resolveNodeModule.sync(`node-libs-browser/mock/${type}`);
    }

    return {
      uri: resolvedFilePath,
      loaderOptions: loaderOptions,
      hash: md5(`webpack:${resolvedFilePath}:${JSON.stringify(loaderOptions)}`)
    };
  }
}

