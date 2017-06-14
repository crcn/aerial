export interface IFileResolver {
    resolve(uri: string, origin?: string): Promise<string>;
}
export declare class NodeModuleResolver {
    readonly options: {
        extensions: string[];
        directories: string[];
    };
    private _kernel;
    constructor(options: {
        extensions: string[];
        directories: string[];
    });
    resolve(relativePath: string, cwd?: string): Promise<string>;
}
