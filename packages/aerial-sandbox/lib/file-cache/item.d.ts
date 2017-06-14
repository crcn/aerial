/// <reference types="node" />
import { IURIProtocolReadResult } from "../uri";
import { Metadata, BaseActiveRecord } from "aerial-common";
export interface IFileCacheItemData {
    _id?: string;
    type: string;
    sourceUri: string;
    contentUri: string;
    synchronized?: boolean;
    updatedAt?: number;
    contentUpdatedAt?: number;
    metadata?: Object;
}
export declare class FileCacheItem extends BaseActiveRecord<IFileCacheItemData> {
    readonly idProperty: string;
    private _kernel;
    type: string;
    updatedAt: number;
    contentUpdatedAt: number;
    contentUri: string;
    sourceUri: string;
    metadata: Metadata;
    private _rawDataUrlContent;
    constructor(source: IFileCacheItemData, collectionName: string);
    readonly synchronized: boolean;
    serialize(): {
        type: string;
        updatedAt: number;
        sourceUri: string;
        contentUpdatedAt: number;
        contentUri: string;
        synchronized: boolean;
        metadata: any;
    };
    shouldUpdate(): boolean;
    willSave(): void;
    setDataUrlContent(content: string | Buffer): Promise<this>;
    setContentUri(uri: string): this;
    read(): Promise<IURIProtocolReadResult>;
    shouldDeserialize(b: IFileCacheItemData): boolean;
    setPropertiesFromSource({sourceUri, type, updatedAt, contentUri, metadata, contentUpdatedAt}: IFileCacheItemData): void;
}
