import { Kernel, Provider, IProvider, IDisposable } from "aerial-common";
import { Dependency, IFileResolver, URIProtocol, DependencyGraph, URIProtocolProvider, IDependencyGraphStrategyOptions } from "../..";
export interface IMockFiles {
    [Identifier: string]: string;
}
export declare class MockFilesProvider extends Provider<IMockFiles> {
    static readonly ID: string;
    constructor(files: IMockFiles);
}
export interface ISandboxTestProviderOptions {
    mockFiles?: IMockFiles;
    providers?: IProvider[];
    fileCacheSync?: boolean;
}
export declare class MockFileURIProtocol extends URIProtocol {
    private _mockFiles;
    private _kernel;
    private _watchers2;
    constructor();
    fileExists(filePath: string): Promise<boolean>;
    read(uri: string): Promise<any>;
    write(uri: string, content: string): Promise<void>;
    watch2(uri: string, onChange: Function): IDisposable;
}
export declare class MockFileResolver implements IFileResolver {
    private _mockFiles;
    resolve(relativePath: string, origin: string): Promise<string>;
}
export declare const timeout: (ms: any) => Promise<{}>;
export declare const createTestSandboxProviders: (options?: ISandboxTestProviderOptions) => (URIProtocolProvider | IProvider[] | MockFilesProvider)[];
export declare const createSandboxTestKernel: (options?: ISandboxTestProviderOptions) => Kernel;
export declare const createTestDependencyGraph: (graphOptions: IDependencyGraphStrategyOptions, kernelOptions: ISandboxTestProviderOptions) => DependencyGraph;
export declare const evaluateDependency: (dependency: Dependency) => Promise<any>;
