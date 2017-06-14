import { FileCache } from "./file-cache";
import { IProvider } from "aerial-common";
import { FileEditor, contentEditorType, IEditor } from "./edit";
import { Kernel, ClassFactoryProvider } from "aerial-common";
export declare class ContentEditorFactoryProvider extends ClassFactoryProvider {
    readonly mimeType: string;
    readonly clazz: contentEditorType;
    readonly autoSave: boolean;
    static readonly NS: string;
    constructor(mimeType: string, clazz: contentEditorType, autoSave?: boolean);
    clone(): ContentEditorFactoryProvider;
    static getNamespace(mimeType: string): string;
    create(uri: string, content: string): IEditor;
    static find(mimeType: string, kernel: Kernel): ContentEditorFactoryProvider;
}
export interface IProtocolResolver {
    resolve(url: string): Promise<any>;
}
export declare class ProtocolURLResolverProvider extends ClassFactoryProvider {
    readonly name: string;
    readonly clazz: {
        new (): IProtocolResolver;
    };
    static readonly NS: string;
    constructor(name: string, clazz: {
        new (): IProtocolResolver;
    });
    clone(): ProtocolURLResolverProvider;
    create(): IProtocolResolver;
    static getId(name: any): string;
    static find(url: string, kernel: Kernel): ProtocolURLResolverProvider;
    static resolve(url: string, kernel: Kernel): string | Promise<any>;
}
export declare const FileCacheProvider: {
    new (clazz: new (...rest: any[]) => FileCache): IProvider;
    getInstance(providers: Kernel): FileCache;
    ID: string;
};
export declare const FileEditorProvider: {
    new (clazz: new (...rest: any[]) => FileEditor): IProvider;
    getInstance(providers: Kernel): FileEditor;
    ID: string;
};
