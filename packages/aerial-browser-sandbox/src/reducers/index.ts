import { 
  Moved, 
  MOVED, 
  moveBox,
  Resized, 
  Removed,
  REMOVED,
  RESIZED, 
  BaseEvent, 
  updateStruct, 
  deleteValueById,
  updateStructProperty, 
} from "aerial-common2";
import { 
  SyntheticWindowLoadedEvent,
  SYNTHETIC_WINDOW_LOADED,
  SYNTHETIC_WINDOW_RECTS_UPDATED,
  SyntheticWindowRectsUpdatedEvent,
  SYNTHETIC_WINDOW_SOURCE_CHANGED,
  SyntheticWindowSourceChangedEvent,
  OPEN_SYNTHETIC_WINDOW, 
  OpenSyntheticBrowserWindowRequest,
  NewSyntheticWindowEntryResolvedEvent,
} from "../actions";
import { 
  SYNTHETIC_WINDOW,
  getSyntheticWindow,
  createSyntheticBrowser, 
  createSyntheticBrowserStore, 
  SyntheticBrowserStore, 
  SyntheticBrowser, 
  addNewSyntheticBrowser, 
  getSyntheticBrowserStore, 
  getSyntheticBrowser, 
  createSyntheticWindow 
} from "../state";


export const syntheticBrowserReducer = (root: any = createSyntheticBrowserStore(), event: BaseEvent) => {
  switch(event.type) {
    case OPEN_SYNTHETIC_WINDOW: {
      const { uri, syntheticBrowserId } = event as OpenSyntheticBrowserWindowRequest;
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
          location: uri
        })
      ]);
    }
    case SYNTHETIC_WINDOW_SOURCE_CHANGED: {
      const { window, syntheticWindowId } = event as SyntheticWindowSourceChangedEvent;
      const syntheticWindow = getSyntheticWindow(root, syntheticWindowId);
      return updateStruct(root, syntheticWindow, {
        mount: window.renderer.mount
      });
    }

    case RESIZED: {
      const { itemId, itemType, box } = event as Resized;
      if (itemType === SYNTHETIC_WINDOW) {
        const window = getSyntheticWindow(root, itemId);
        if (window) {
          return updateStructProperty(root, window, "box", box);
        }
        break;
      }
    }

    case MOVED: {
      const { itemId, itemType, point } = event as Moved;
      if (itemType === SYNTHETIC_WINDOW) {
        const window = getSyntheticWindow(root, itemId);
        if (window) {
          return updateStructProperty(root, window, "box", moveBox(window.box, point));
        }
        break;
      }
    }

    case REMOVED: {
      const { itemId, itemType } = event as Removed;
      if (itemType === SYNTHETIC_WINDOW) {
        return deleteValueById(root, itemId);
      }
    }

    case SYNTHETIC_WINDOW_LOADED: {
      const { syntheticWindowId, document } = event as SyntheticWindowLoadedEvent;
      const window = getSyntheticWindow(root, syntheticWindowId);
      return updateStructProperty(root, window, "document", document);
    }

    case SYNTHETIC_WINDOW_RECTS_UPDATED: {
      const { rects, syntheticWindowId } = event as SyntheticWindowRectsUpdatedEvent;
      const window = getSyntheticWindow(root, syntheticWindowId);
      return updateStructProperty(root, window, "computedBoxes", rects);
    }
  }

  return root;
}