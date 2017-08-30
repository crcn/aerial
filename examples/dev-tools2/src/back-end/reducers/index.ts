import { BaseEvent } from "aerial-common2";
import { Bundled, BUNDLED } from "../actions";
import { ApplicationState, setBundleInfo, BundleEntryInfo, BundleInfo } from "../state";

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
  }

  return state;
}
