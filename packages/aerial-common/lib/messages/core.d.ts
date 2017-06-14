import { CoreEvent } from "./base";
import { DSInsertRequest, DSRemoveRequest, DSUpdateRequest, DSMessage } from "mesh-ds";
import { Message } from "mesh";
export { CoreEvent };
export declare class DisposeEvent extends CoreEvent {
    static readonly DISPOSE: string;
    constructor();
}
export declare class LoadApplicationRequest extends Message {
    static readonly LOAD: string;
    constructor();
}
export declare class InitializeApplicationRequest extends Message {
    static readonly INITIALIZE: string;
    constructor();
}
export declare class ApplicationReadyMessage extends Message {
    static readonly READY: string;
    constructor();
}
export declare class DSUpsertRequest<T> extends DSMessage {
    readonly data: any;
    readonly query: T;
    static readonly DS_UPSERT: string;
    constructor(collectionName: string, data: any, query: T);
}
export declare class PostDSMessage extends DSMessage {
    readonly data: any;
    readonly timestamp: number;
    static readonly DS_DID_INSERT: string;
    static readonly DS_DID_REMOVE: string;
    static readonly DS_DID_UPDATE: string;
    constructor(type: string, collectionName: string, data: any, timestamp: number);
    static createFromDSRequest(request: DSInsertRequest<any> | DSUpdateRequest<any, any> | DSRemoveRequest<any>, data: any): PostDSMessage;
}
export declare class MetadataChangeEvent extends CoreEvent {
    readonly key: string;
    readonly value: string;
    static readonly METADATA_CHANGE: string;
    constructor(key: string, value: string);
}
