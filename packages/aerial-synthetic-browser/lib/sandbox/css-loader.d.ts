import { Dependency, BaseDependencyLoader, IDependencyLoaderResult } from "aerial-sandbox";
export declare class CSSDependencyLoader extends BaseDependencyLoader {
    private _kernel;
    load(dependency: Dependency, {type, content, map}: {
        type: any;
        content: any;
        map: any;
    }): Promise<IDependencyLoaderResult>;
}
