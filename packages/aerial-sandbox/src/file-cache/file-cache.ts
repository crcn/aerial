import memoize =  require("memoizee");
import { FileCacheSynchronizer } from "./synchronizer";

import {
  inject,
  Kernel,
  IBrokerBus,
  Observable,
  createDataUrl,
  KernelProvider,
  MimeTypeProvider,
  PrivateBusProvider,
  ActiveRecordCollection,
} from "aerial-common";

import { DSFindRequest } from "mesh-ds";
import { WritableStream } from "mesh";

import { FileCacheItem, IFileCacheItemData } from "./item";

export const FILE_CACHE_COLLECTION_NAME = "fileCache";

export const getAllUnsavedFiles = (kernel: Kernel) => {
  return new Promise<FileCacheItem[]>((resolve, reject) => {
    const chunks: IFileCacheItemData[] = [];
    PrivateBusProvider.getInstance(kernel).dispatch(new DSFindRequest(FILE_CACHE_COLLECTION_NAME, { synchronized: false }, true)).readable.pipeTo(new WritableStream<IFileCacheItemData>({
      write(chunk) {
        chunks.push(chunk);
      },
      close() {
        resolve(chunks.map((item) => kernel.inject(new FileCacheItem(item, FILE_CACHE_COLLECTION_NAME))))
      },
      abort: reject
    }));
  })
}

// TODO - move a lot of this logic to ActiveRecordCollection
// TODO - remove files here after TTL
export class FileCache extends Observable {

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  private _synchronizer: FileCacheSynchronizer;
  private _collection: ActiveRecordCollection<FileCacheItem, IFileCacheItemData>;

  constructor() {
    super();
  }

  public $didInject() {
    this._collection = new ActiveRecordCollection(this.collectionName, this._kernel, (source: IFileCacheItemData) => {
      return this._kernel.inject(new FileCacheItem(source, this.collectionName));
    });
    this._collection.load();
    this._collection.sync();
  }

  eagerFindByFilePath(sourceUri) {
    return this.collection.find(item => item.sourceUri === sourceUri);
  }

  get collection() {
    return this._collection;
  }

  get collectionName() {
    return FILE_CACHE_COLLECTION_NAME;
  }

  /**
   * ability to shove temporary files into mem -- like unsaved files.
   */

  async save(sourceUri: string, data?: { type?: string, content?: string|Buffer }): Promise<FileCacheItem> {
    const fileCache = await this.collection.loadItem({ sourceUri });

    if (!fileCache) {
      const type = data && data.type || MimeTypeProvider.lookup(sourceUri, this._kernel);
      return this.collection.create({
        type: type,
        sourceUri: sourceUri,
        contentUri: data ? createDataUrl(data.content, type) : sourceUri,
        contentUpdatedAt: 0,
      }).insert();
    } else {
      if (data && data.content) {
        if (data.type) fileCache.type = data.type;
        await fileCache.setDataUrlContent(data.content);
      }
      return fileCache.save();
    }
  }

  /**
   * Returns an existing cache item entry, or creates a new one
   * from the file system
   */

  find = memoize(async (sourceUri: string): Promise<FileCacheItem> => {
    if (sourceUri == null) throw new Error(`File path must not be null or undefined`);
    return this.collection.find((entity) => entity.sourceUri === sourceUri) || await this.collection.loadItem({ sourceUri });
  }, { promise: true }) as (uri: string) => Promise<FileCacheItem>;

  /**
   * Returns an existing cache item entry, or creates a new one
   * from the file system
   */

  findOrInsert = memoize(async (sourceUri: string): Promise<FileCacheItem> => {
    if (sourceUri == null) throw new Error(`File path must not be null or undefined`);
    return this.collection.find((entity) => entity.sourceUri === sourceUri) || await this.save(sourceUri);
  }, { promise: true }) as (uri: string) => Promise<FileCacheItem>;

  /**
   * Synchronizes the file cache DS with the file system. This is intended
   * to be used the master process -- typically the node server.
   */

  syncWithLocalFiles() {
    return this._synchronizer || (this._synchronizer = this._kernel.inject(new FileCacheSynchronizer(this, this._bus)));
  }
}
