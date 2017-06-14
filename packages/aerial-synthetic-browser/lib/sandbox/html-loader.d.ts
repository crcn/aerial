import { Dependency, BaseDependencyLoader, IDependencyLoaderResult } from "aerial-sandbox";
export declare class HTMLDependencyLoader extends BaseDependencyLoader {
    private _kernel;
    load(dependency: Dependency, {type, content}: {
        type: any;
        content: any;
    }): Promise<IDependencyLoaderResult>;
}
