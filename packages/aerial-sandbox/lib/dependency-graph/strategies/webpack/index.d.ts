/// <reference types="node" />
import { Logger, Kernel } from "aerial-common";
import { IDependencyLoader, IResolvedDependencyInfo, IDependencyGraphStrategy } from "../base";
import { IModule } from "aerial-sandbox/sandbox";
export interface IWebpackLoaderConfig {
    test: RegExp | ((uri: string) => boolean);
    include: string[];
    exclude: string[];
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
    loaders: INormalizedWebpackLoaderConfig[];
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
    node: IWebpackNodeConfig;
    resolve: IWebpackResolveConfig;
    module: {
        preLoaders?: IWebpackLoaderConfig[];
        loaders: IWebpackLoaderConfig[];
        postLoaders?: IWebpackLoaderConfig[];
    };
}
export declare class MockWebpackCompiler {
    plugin(key: string, callback: any): void;
}
export declare class WebpackSandboxContext {
    private _target;
    readonly module: WebpackSandboxContext;
    readonly id: string;
    readonly __filename: string;
    readonly __dirname: string;
    constructor(_target: IModule);
    exports: any;
}
export declare class WebpackProtocolResolver {
    resolve(url: any): Promise<string>;
}
export declare class WebpackProtocolHandler {
}
/**
 */
export declare class WebpackDependencyGraphStrategy implements IDependencyGraphStrategy {
    protected readonly logger: Logger;
    private _kernel;
    private _resolver;
    private _config;
    readonly config: IWebpackConfig;
    readonly compiler: MockWebpackCompiler;
    readonly basedir: string;
    constructor(options?: any);
    readonly kernel: Kernel;
    createGlobalContext(): {
        Buffer: {
            new (str: string, encoding?: string): Buffer;
            new (size: number): Buffer;
            new (array: Uint8Array): Buffer;
            new (arrayBuffer: ArrayBuffer): Buffer;
            new (array: any[]): Buffer;
            new (buffer: Buffer): Buffer;
            prototype: Buffer;
            from(array: any[]): Buffer;
            from(arrayBuffer: ArrayBuffer, byteOffset?: number, length?: number): Buffer;
            from(buffer: Buffer): Buffer;
            from(str: string, encoding?: string): Buffer;
            isBuffer(obj: any): obj is Buffer;
            isEncoding(encoding: string): boolean;
            byteLength(string: string, encoding?: string): number;
            concat(list: Buffer[], totalLength?: number): Buffer;
            compare(buf1: Buffer, buf2: Buffer): number;
            alloc(size: number, fill?: string | number | Buffer, encoding?: string): Buffer;
            allocUnsafe(size: number): Buffer;
            allocUnsafeSlow(size: number): Buffer;
        };
        __webpack_public_path__: string;
        process: {
            argv: any[];
            version: string;
            nextTick: (next: any) => number;
            env: any;
            cwd: () => string;
        };
    };
    createModuleContext(module: IModule): WebpackSandboxContext;
    /**
     * Results the relative file path from the cwd, and provides
     * information about how it should be treared.
     *
     * Examples:
     * const dependencyInfo = resolver.resolve('text!./module.mu');
     * const dependencyInfo = resolver.resolve('template!./module.mu');
     */
    getLoader(options: IWebpackLoaderOptions): IDependencyLoader;
    resolve(moduleInfo: string, cwd: string): Promise<IResolvedDependencyInfo>;
}
