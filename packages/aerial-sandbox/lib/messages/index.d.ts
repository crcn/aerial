import { IDisposable, Mutation } from "aerial-common";
import { Message, IMessage, IStreamableBus } from "mesh";
import { IURIProtocolReadResult } from "../uri";
export declare class UpdateFileCacheRequest implements IMessage {
    readonly uri: string;
    readonly content: string;
    readonly updatedAt: number;
    static readonly UPDATE_FILE_CACHE: string;
    readonly type: string;
    constructor(uri: string, content: string, updatedAt?: number);
}
export declare class ApplyFileEditRequest extends Message {
    readonly mutations: Mutation<any>[];
    readonly saveFile: boolean;
    static readonly APPLY_EDITS: string;
    constructor(mutations: Mutation<any>[], saveFile?: boolean);
}
export declare class ModuleImporterAction extends Message {
    static readonly MODULE_CONTENT_CHANGED: string;
}
export declare class SandboxModuleAction extends Message {
    static readonly EVALUATING: string;
    static readonly EDITED: string;
}
export declare class FileCacheAction extends Message {
    readonly item: any;
    static readonly ADDED_ENTITY: string;
    constructor(type: string, item?: any);
}
export declare class ReadFileRequest extends Message {
    readonly uri: string;
    static readonly READ_FILE: string;
    constructor(uri: string);
    static dispatch(uri: string, bus: IStreamableBus<any>): Promise<IURIProtocolReadResult>;
}
export declare class WriteFileRequest extends Message {
    readonly uri: string;
    readonly content: string;
    readonly options: any;
    static readonly WRITE_FILE: string;
    constructor(uri: string, content: string, options?: any);
    static dispatch(uri: string, content: string, options: any, bus: IStreamableBus<any>): Promise<any>;
}
export declare class WatchFileRequest extends Message {
    readonly uri: string;
    static readonly WATCH_FILE: string;
    constructor(uri: string);
    static dispatch(uri: string, bus: IStreamableBus<any>, onFileChange: () => any): IDisposable;
}
