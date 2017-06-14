import { IDependencyLoader, Dependency, IDependencyLoaderResult } from "aerial-sandbox";
export declare class CommonJSandboxLoader implements IDependencyLoader {
    constructor();
    load(dependency: Dependency, {type, content}: {
        type: any;
        content: any;
    }): Promise<IDependencyLoaderResult>;
}
