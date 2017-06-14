import { IModule } from "../../sandbox";
import { Dependency } from "../dependency";
import { IDependencyContent } from "../base";
import { IDependencyGraphStrategyOptions } from "../graph";
export interface IResolvedDependencyInfo {
    /**
     */
    originalUri?: string;
    /**
     */
    hash: string;
    /**
     * Resolved file path
     */
    uri: string;
    /**
     * The loader for the file path
     */
    loaderOptions?: any;
}
export interface IDependencyLoaderResult extends IDependencyContent {
    /**
     *  Dependencies that imported in at runtime.
     */
    importedDependencyUris?: string[];
    /**
     * Dependencies that are included and part of the loaded content
     */
    includedDependencyUris?: string[];
}
export interface IDependencyLoader {
    load(dependency: Dependency, content: IDependencyContent): Promise<IDependencyLoaderResult>;
}
export interface IDependencyGraphStrategy {
    options?: IDependencyGraphStrategyOptions;
    /**
     * Returns a loader with the given options. Example
     *
     * strategy.getLoader(['text']); // new TextDependencyLoader()
     */
    getLoader(loaderOptions: any): IDependencyLoader;
    /**
     * Returns where the target file path is and how it should be loaded. Examples
     *
     * strategy.resolve('text!./uri.txt', 'src/content') // { uri: src/content/uri.txt, loaderOptions: ['text'] }
     */
    resolve(uri: string, origin: string): Promise<IResolvedDependencyInfo>;
    /**
     * Strategies may contain global variables that need to be
     * accessed by dependencies when evaluated in the Sandbox (such as Webpack and __webpack_public_path__)
     */
    createGlobalContext(): any;
    /**
     * Returns a context where the dependency can be evaluated in
     */
    createModuleContext(module: IModule): any;
}
