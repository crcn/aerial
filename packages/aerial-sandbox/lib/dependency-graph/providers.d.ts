import { Kernel, Provider, ClassFactoryProvider } from "aerial-common";
import { DependencyGraph, IDependencyGraphStrategyOptions } from "./graph";
import { IDependencyLoader, dependencyLoaderType, IDependencyGraphStrategy } from "./strategies";
export declare class DependencyLoaderFactoryProvider extends ClassFactoryProvider {
    readonly mimeType: string;
    static readonly NS: string;
    constructor(mimeType: string, value: dependencyLoaderType);
    static getNamespace(mimeType: string): string;
    create(strategy: IDependencyGraphStrategy): IDependencyLoader;
    static find(mimeType: string, kernel: Kernel): DependencyLoaderFactoryProvider;
    clone(): DependencyLoaderFactoryProvider;
}
export declare class DependencyGraphStrategyProvider extends ClassFactoryProvider {
    readonly name: string;
    static ID: string;
    constructor(name: string, clazz: {
        new (config: any): IDependencyGraphStrategy;
    });
    static getNamespace(name: string): string;
    static create(strategyName: string, options: any, kernel: Kernel): IDependencyGraphStrategy;
}
export declare class DependencyGraphProvider extends Provider<any> {
    readonly clazz: {
        new (strategy: IDependencyGraphStrategy): DependencyGraph;
    };
    static ID: string;
    private _instances;
    constructor(clazz: {
        new (strategy: IDependencyGraphStrategy): DependencyGraph;
    });
    clone(): DependencyGraphProvider;
    getInstance(options: IDependencyGraphStrategyOptions): DependencyGraph;
    static getInstance(options: IDependencyGraphStrategyOptions, kernel: Kernel): DependencyGraph;
}
export declare class DependencyGraphStrategyOptionsProvider extends Provider<IDependencyGraphStrategyOptions> {
    readonly name: string;
    readonly test: (uri: string) => boolean;
    readonly options: IDependencyGraphStrategyOptions;
    static readonly NS: string;
    constructor(name: string, test: (uri: string) => boolean, options: IDependencyGraphStrategyOptions);
    static getId(name: string): string;
    clone(): DependencyGraphStrategyOptionsProvider;
    static find(uri: string, kernel: Kernel): IDependencyGraphStrategyOptions;
}
