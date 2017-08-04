import { BaseEvent, updateStructProperty, updateStruct } from "aerial-common2";
import { NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED, NewSyntheticWindowEntryResolvedEvent } from "../actions";
import { createSyntheticBrowser, createSyntheticBrowserStore, SyntheticBrowserStore, SyntheticBrowser, addNewSyntheticBrowser, getSyntheticBrowserStore, getSyntheticBrowser, createSyntheticWindow } from "../state";

export const syntheticBrowserReducer = (root: any = createSyntheticBrowserStore(), event: BaseEvent) => {
  switch(event.type) {
    case NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED: {
      const { location, syntheticBrowserId } = event as NewSyntheticWindowEntryResolvedEvent;
      let syntheticBrowser: SyntheticBrowser;
      if (!syntheticBrowserId) {
        const result = addNewSyntheticBrowser(root);
        root = result.root;
        syntheticBrowser = result.syntheticBrowser;
      } else {
        syntheticBrowser = getSyntheticBrowser(root, syntheticBrowserId);
      }
      return updateStructProperty(root, syntheticBrowser, "windows", [
        ...syntheticBrowser.windows,
        createSyntheticWindow({
          location
        })
      ]);
    }
  }

  return root;
}