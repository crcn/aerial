import { IModule } from "../sandbox";
import { IDependencyLoader, IResolvedDependencyInfo, IDependencyGraphStrategy } from "./strategies";
import { Dependency, IDependencyData } from "./dependency";
import { Logger, Kernel, Observable, ActiveRecordCollection } from "aerial-common";
export interface IDependencyGraphStrategyOptions {
    name?: string;
    rootDirectoryUri?: string;
    config?: any;
}
export interface IDependencyGraph {
    createGlobalContext(): any;
    createModuleContext(module: IModule): any;
    getLoader(options: any): IDependencyLoader;
    eagerFindByHash(hash: any): Dependency;
    resolve(uri: string, cwd: string): Promise<IResolvedDependencyInfo>;
    getDependency(info: IResolvedDependencyInfo): Promise<Dependency>;
    loadDependency(info: IResolvedDependencyInfo): Promise<Dependency>;
}
/**
 * Singleton graph dependency for mapping and transforming application source code
 * into one bundle file.
 */
export declare class DependencyGraph extends Observable implements IDependencyGraph {
    private _strategy;
    protected readonly logger: Logger;
    private _collection;
    $strategy: IDependencyGraphStrategy;
    $kernel: Kernel;
    constructor(_strategy: IDependencyGraphStrategy);
    $didInject(): void;
    readonly collection: ActiveRecordCollection<Dependency, IDependencyData>;
    createGlobalContext(): any;
    createModuleContext(module: IModule): any;
    getLoader(options: any): IDependencyLoader;
    readonly collectionName: string;
    /**
     * Looks for a loaded item. Though, it may not exist in memory, but it *may* exist in some other
     * process.
     */
    eagerFindByHash(hash: any): Dependency;
    /**
     */
    resolve(uri: string, origin?: string): Promise<IResolvedDependencyInfo>;
    /**
     */
    getDependency: (ops: IResolvedDependencyInfo) => Promise<Dependency>;
    /**
     */
    loadDependency: (ops: IResolvedDependencyInfo) => Promise<Dependency>;
}
