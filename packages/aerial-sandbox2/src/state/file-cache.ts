import { Struct, createStructFactory, getValuesByType } from "aerial-common2";

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

export type FileCache = {
  allFiles: {
    [identifier: string]: FileCacheItem
  }
} & Struct;

export const createFileCacheItem = createStructFactory<FileCacheItem>(FILE_CACHE_ITEM);
export const createFileCache  = createStructFactory<FileCache>(FILE_CACHE, {
  allFiles: {

  }
});

export const getFileCache = (root: any): FileCache => getValuesByType(root, FILE_CACHE)[0];

export const getFileCacheItemByUri = (root: any, uri: string) => {
  const cache = getFileCache(root);
  return cache.allFiles[uri.replace(/\./g, "_")];
}