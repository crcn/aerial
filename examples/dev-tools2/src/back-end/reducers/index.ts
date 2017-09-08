import { BaseEvent } from "aerial-common2";
import { Bundled, BUNDLED, FILE_CONTENT_MUTATED, FileContentMutated, FILE_CHANGED, FileChanged } from "../actions";
import { ApplicationState, setBundleInfo, setFileCacheContent, BundleEntryInfo, BundleInfo, removeFileCache, getFileCacheItem } from "../state";

export function mainReducer(state: ApplicationState, event: BaseEvent) {
  switch(event.type) {
    case BUNDLED: {
      const { stats } = event as Bundled;

      const entryPathHashMap = new Map<string, string>();

      const bundleInfo: BundleInfo = {};

      for (const name in stats.compilation.entrypoints) {
        const { chunks: [{ entryModule: { resource: filePath } }] } = stats.compilation.entrypoints[name];
        entryPathHashMap.set(filePath, name);
      }
      stats.compilation.modules.forEach((module) => {
        const entryHash = entryPathHashMap.get(module.resource);
        if (entryHash) {
          bundleInfo[entryHash] = {
            buildTimestamp: module.buildTimestamp
          }
        }
      });

      state = setBundleInfo(state, bundleInfo);
      break;
    }

    case FILE_CONTENT_MUTATED: {
      const { filePath, content, mtime } = event as FileContentMutated;
      return setFileCacheContent(state, filePath, content, mtime);
    }
    
    case FILE_CHANGED: {
      const { filePath, mtime } = event as FileChanged;
      const fileCacheItem = getFileCacheItem(filePath, state);
      if (fileCacheItem && fileCacheItem.mtime.getDate() < mtime.getDate()) {
        return removeFileCache(state, filePath);
      } else {
        return state;
      }
    }
  }

  return state;
}
