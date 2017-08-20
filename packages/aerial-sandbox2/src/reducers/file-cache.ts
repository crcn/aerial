import { UriCacheBusted, URI_CACHE_BUSTED, UriWrittenEvent, URI_WRITTEN } from "../actions";
import { BaseEvent, dsInsert, dsUpdate, dsUpdateOne } from "aerial-common2";
import { FileCacheRootState, FileCacheItem, createFileCacheRootState, createFileCacheItem, getFileCacheItemByUri } from "../state";

export const fileCacheReducer = <TRootState extends FileCacheRootState>(root: TRootState = createFileCacheRootState() as TRootState, event: BaseEvent): TRootState => {
  switch(event.type) {
    case URI_CACHE_BUSTED: {
      const { uri, content, contentType } = event as UriCacheBusted;
      const item = getFileCacheItemByUri(root, uri);
      const newProperties = {
        sourceUri: uri,
        content,
        contentType
      };

      return {
        ...(root as any),
        fileCacheStore: item ? dsUpdateOne(root.fileCacheStore, { $id: item.$id }, newProperties) : dsInsert(root.fileCacheStore, createFileCacheItem
        (newProperties))
      };
    }

    case URI_WRITTEN: {
      const { uri, content, contentType } = event as UriWrittenEvent;
      const item = getFileCacheItemByUri(root, uri);
      if (!item) return root;
      return {
        ...(root as any),
        fileCacheStore: dsUpdateOne(root.fileCacheStore, { $id: item.$id }, {
          sourceUri: uri,
          content, 
          contentType: contentType || item.contentType
        })
      };
    }
  }
  return root;
}