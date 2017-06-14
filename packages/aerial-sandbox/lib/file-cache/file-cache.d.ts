/// <reference types="node" />
import { FileCacheSynchronizer } from "./synchronizer";
import { Kernel, Observable, ActiveRecordCollection } from "aerial-common";
import { FileCacheItem, IFileCacheItemData } from "./item";
export declare const FILE_CACHE_COLLECTION_NAME = "fileCache";
export declare const getAllUnsavedFiles: (kernel: Kernel) => Promise<FileCacheItem[]>;
export declare class FileCache extends Observable {
    private _kernel;
    private _bus;
    private _synchronizer;
    private _collection;
    constructor();
    $didInject(): void;
    eagerFindByFilePath(sourceUri: any): FileCacheItem;
    readonly collection: ActiveRecordCollection<FileCacheItem, IFileCacheItemData>;
    readonly collectionName: string;
    /**
     * ability to shove temporary files into mem -- like unsaved files.
     */
    save(sourceUri: string, data?: {
        type?: string;
        content?: string | Buffer;
    }): Promise<FileCacheItem>;
    /**
     * Returns an existing cache item entry, or creates a new one
     * from the file system
     */
    find: (uri: string) => Promise<FileCacheItem>;
    /**
     * Returns an existing cache item entry, or creates a new one
     * from the file system
     */
    findOrInsert: (uri: string) => Promise<FileCacheItem>;
    /**
     * Synchronizes the file cache DS with the file system. This is intended
     * to be used the master process -- typically the node server.
     */
    syncWithLocalFiles(): FileCacheSynchronizer;
}
