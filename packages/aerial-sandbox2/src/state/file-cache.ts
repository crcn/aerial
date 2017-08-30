import { weakMemo, Struct, createStructFactory, createDSQuery, DataStore, dsIndex, createDataStore, dsFind, dsUpdateOne, dsRemoveOne } from "aerial-common2";

export const FILE_CACHE = "FILE_CACHE";
export const FILE_CACHE_ITEM = "FILE_CACHE_ITEM";

/**
 * Cache for files so that the dependency graph doesn't go back to the 
 * source when the sandbox re-evaluates. The file watcher will make sure that this is up to date. 
 */

export type FileCacheItem = {

  /**
   * the source file of the cached item
   */

  sourceUri: string;

  /**
   * the file cache mime type
   */

  contentType: string;

  /**
   */

  content: string|Buffer;

  /**
   */

  updatedAt: Date;
} & Struct;

export type FileCacheRootState = {
  fileCacheStore: DataStore<FileCacheItem>
};

export const createFileCacheItem = createStructFactory<FileCacheItem>(FILE_CACHE_ITEM);
export const createFileCacheStore = (items?: FileCacheItem[]) => dsIndex(dsIndex(createDataStore(items), "$id", true), "sourceUri", true);
export const createFileCacheRootState  = (items?: FileCacheItem[]): FileCacheRootState => ({
  fileCacheStore: createFileCacheStore(items)
});

export const getFileCacheStore = (root: FileCacheRootState) => root.fileCacheStore;

export const getFileCacheItemByUri = (root: FileCacheRootState, uri: string) => {
  return dsFind(root.fileCacheStore, createDSQuery("sourceUri", uri));
};

export const getFileCacheItemById = (root: FileCacheRootState, id: string) => {
  return dsFind(root.fileCacheStore, createDSQuery("$id", id));
};

export const removeFileCacheItemByUri = (root: FileCacheRootState, uri: string) => {
  return {
    ...root,
    fileCacheStore: dsRemoveOne(root.fileCacheStore, createDSQuery("sourceUri", uri))
  };
};

export const updateFileCacheItem = <TState extends FileCacheRootState>(root: TState, fileCacheItemId: string, properties: Partial<FileCacheItem>): TState => {
  return {
    ...(root as any),
    fileCacheStore: dsUpdateOne(root.fileCacheStore, createDSQuery("$id", fileCacheItemId), properties)
  };
};