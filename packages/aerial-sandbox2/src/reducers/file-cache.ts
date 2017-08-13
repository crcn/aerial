import { BaseEvent, updateStruct, updateStructProperty, getValueById } from "aerial-common2";
import { FileCache, createFileCache, createFileCacheItem, getFileCache, getFileCacheItemByUri } from "../state";
import { UriCacheBustedEvent, URI_CACHE_BUSTED, UriWrittenEvent, URI_WRITTEN } from "../actions";

export const fileCacheReducer = (root: any = createFileCache(), event: BaseEvent) => {
  switch(event.type) {
    case URI_CACHE_BUSTED: {
      const { uri, content, contentType } = event as UriCacheBustedEvent;
      const item = getFileCacheItemByUri(root, uri) || {};
      const cache = getFileCache(root);

      return updateStructProperty(root, cache, "allFiles", {
        ...cache.allFiles,
        [uri.replace(/\./g, "_")]: createFileCacheItem({
          ...item,
          sourceUri: uri,
          content,
          contentType
        })
      })
    }
    case URI_WRITTEN: {
      const { uri, content, contentType } = event as UriWrittenEvent;
      const item = getFileCacheItemByUri(root, uri);
      if (!item) return root;
      return updateStruct(root, item, {
        sourceUri: uri,
        content, 
        contentType: contentType || item.contentType
      });
    }
  }
  return root;
}