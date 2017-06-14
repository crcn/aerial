import { IModule } from "../../../sandbox";
import { Dependency } from "../../dependency";
import { IDependencyContent } from "../../base";
import { IDependencyLoader, IDependencyLoaderResult, IResolvedDependencyInfo, IDependencyGraphStrategy } from "../base";
import { IDependencyGraphStrategyOptions } from "../../graph";
export declare type dependencyLoaderType = {
    new (strategy: IDependencyGraphStrategy): IDependencyLoader;
};
export declare abstract class BaseDependencyLoader implements IDependencyLoader {
    readonly strategy: IDependencyGraphStrategy;
    constructor(strategy: IDependencyGraphStrategy);
    abstract load(info: IResolvedDependencyInfo, content: IDependencyContent): Promise<IDependencyLoaderResult>;
}
export declare class DefaultDependencyLoader implements IDependencyLoader {
    readonly stragegy: DefaultDependencyGraphStrategy;
    readonly options: any;
    private _kernel;
    constructor(stragegy: DefaultDependencyGraphStrategy, options: any);
    load(dependency: Dependency, content: IDependencyContent): Promise<IDependencyLoaderResult>;
}
export declare class DefaultDependencyGraphStrategy implements IDependencyGraphStrategy {
    readonly options: IDependencyGraphStrategyOptions;
    private _kernel;
    constructor(options: IDependencyGraphStrategyOptions);
    getLoader(loaderOptions: any): IDependencyLoader;
    createGlobalContext(): {};
    createModuleContext(module: IModule): {
        module: IModule;
        exports: any;
        __filename: string;
        __dirname: string;
    };
    /**
     * TODO - move logic here to HTTP resolver since there's some logic such as resolving indexes, and redirects
     * that also need to be considered here.
     */
    resolve(relativeUri: string, origin: string): Promise<IResolvedDependencyInfo>;
}
