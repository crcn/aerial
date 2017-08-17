import { 
  Box,
  Moved, 
  MOVED, 
  Mutation,
  moveBox,
  Resized, 
  Removed,
  REMOVED,
  RESIZED,
  getValueById,
  BaseEvent, 
  updateStruct, 
  deleteValueById,
  updateStructProperty, 
} from "aerial-common2";
import { uniq } from "lodash";
import { 
  SyntheticWindowLoadedEvent,
  SyntheticWindowPatchedEvent,
  SYNTHETIC_WINDOW_RESOURCE_LOADED,
  SyntheticWindowResourceLoadedEvent,
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
  SyntheticNode,
  SyntheticWindow,
  SYNTHETIC_WINDOW,
  isSyntheticNodeType,
  DEFAULT_SYNTHETIC_WINDOW_BOX,
  getSyntheticWindow,
  createSyntheticBrowser, 
  createSyntheticBrowserRootState, 
  SyntheticBrowserRootState, 
  SyntheticBrowser, 
  addNewSyntheticBrowser, 
  getSyntheticBrowserRootState, 
  getSyntheticBrowser, 
  createSyntheticWindow 
} from "../state";

const WINDOW_PADDING = 50;

const getBestWindowBox = (browser: SyntheticBrowser, box: Box) => {
  if (!browser.windows.length) return box;
  const rightMostWindow = browser.windows.length > 1 ? browser.windows.reduce((a, b) => {
    return a.box.right > b.box.right ? a : b;
  }) : browser.windows[0];

  return moveBox(box, {
    left: rightMostWindow.box.right + WINDOW_PADDING,
    top: rightMostWindow.box.top
  });
};


export const syntheticBrowserReducer = (root: any = createSyntheticBrowserRootState(), event: BaseEvent) => {
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
          location: uri,
          box: getBestWindowBox(syntheticBrowser, DEFAULT_SYNTHETIC_WINDOW_BOX)
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
      break;
    }

    case REMOVED: {
      const { itemId, itemType } = event as Removed;
      const value = getValueById(root, itemId);
      if (itemType === SYNTHETIC_WINDOW || value.nodeType != null) {
        return deleteValueById(root, itemId);
      }

      break;
    }

    case SYNTHETIC_WINDOW_LOADED: {
      const { syntheticWindowId, document } = event as SyntheticWindowLoadedEvent;
      const window = getSyntheticWindow(root, syntheticWindowId);
      return updateStructProperty(root, window, "document", document);
    }

    case SYNTHETIC_WINDOW_RECTS_UPDATED: {
      const { rects, styles, syntheticWindowId } = event as SyntheticWindowRectsUpdatedEvent;
      const window = getSyntheticWindow(root, syntheticWindowId);
      return updateStruct(root, window, {
        computedBoxes: rects,
        computedStyles: styles
      });
    }

    case SYNTHETIC_WINDOW_RESOURCE_LOADED: {
      const { uri, syntheticWindowId } = event as SyntheticWindowResourceLoadedEvent;
      const window = getSyntheticWindow(root, syntheticWindowId);
      return updateStructProperty(root, window, "externalResourceUris", uniq([
        ...window.externalResourceUris,
        uri
      ]));
    }
  }

  return root;
}

const patchSyntheticWindow = (window: SyntheticWindow, mutations: Mutation<any>[]) => {
  for (const mutation of mutations) {
    const target = getValueById(window, mutation.target.uid);
  }
  return window;
}