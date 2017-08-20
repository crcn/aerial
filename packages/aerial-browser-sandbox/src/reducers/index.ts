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
  BaseEvent, 
} from "aerial-common2";
import { uniq } from "lodash";
import { 
  SyntheticWindowLoaded,
  windowPatched,
  SYNTHETIC_WINDOW_RESOURCE_LOADED,
  SyntheticWindowResourceLoaded,
  SYNTHETIC_WINDOW_LOADED,
  SYNTHETIC_WINDOW_RECTS_UPDATED,
  SYNTHETIC_WINDOW_SCROLLED,
  SyntheticWindowScrolled,
  SyntheticWindowRectsUpdated,
  SYNTHETIC_WINDOW_SOURCE_CHANGED,
  SyntheticWindowSourceChanged,
  OPEN_SYNTHETIC_WINDOW, 
  OpenSyntheticBrowserWindow,
  NewSyntheticWindowEntryResolved,
} from "../actions";
import { 
  SyntheticNode,
  SyntheticWindow,
  SYNTHETIC_WINDOW,
  removeSyntheticWindow,
  isSyntheticNodeType,
  DEFAULT_SYNTHETIC_WINDOW_BOX,
  getSyntheticWindow,
  createSyntheticBrowser, 
  updateSyntheticWindow,
  updateSyntheticBrowser,
  createSyntheticBrowserRootState, 
  SyntheticBrowserRootState, 
  SyntheticBrowser, 
  addSyntheticBrowser, 
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


export const syntheticBrowserReducer = <TRootState extends SyntheticBrowserRootState>(root: TRootState = createSyntheticBrowserRootState() as TRootState, event: BaseEvent) => {

  switch(event.type) {
    case OPEN_SYNTHETIC_WINDOW: {
      const { uri, syntheticBrowserId } = event as OpenSyntheticBrowserWindow;
      let syntheticBrowser: SyntheticBrowser;
      if (!syntheticBrowserId) {
        root = addSyntheticBrowser(root, syntheticBrowser = createSyntheticBrowser());
      } else {
        syntheticBrowser = getSyntheticBrowser(root, syntheticBrowserId);
      }
      
      return updateSyntheticBrowser(root, syntheticBrowser.$$id, {
        windows: [
          ...syntheticBrowser.windows,
          createSyntheticWindow({
            location: uri,
            box: getBestWindowBox(syntheticBrowser, DEFAULT_SYNTHETIC_WINDOW_BOX)
          })
        ]
      });
    }

    case SYNTHETIC_WINDOW_SOURCE_CHANGED: {
      const { window, syntheticWindowId } = event as SyntheticWindowSourceChanged;
      return updateSyntheticWindow(root, syntheticWindowId, {
        mount: window.renderer.mount
      });
    }
    
    case SYNTHETIC_WINDOW_SCROLLED: {
      const { scrollPosition, syntheticWindowId } = event as SyntheticWindowScrolled;
      return updateSyntheticWindow(root, syntheticWindowId, {
        scrollPosition,
      });
    }

    case RESIZED: {
      const { itemId, itemType, box } = event as Resized;
      if (itemType === SYNTHETIC_WINDOW) {
        const window = getSyntheticWindow(root, itemId);
        if (window) {
          return updateSyntheticWindow(root, itemId, {
            box
          });
        }
        break;
      }
    }

    case MOVED: {
      const { itemId, itemType, point } = event as Moved;
      if (itemType === SYNTHETIC_WINDOW) {
        const window = getSyntheticWindow(root, itemId);
        if (window) {
          return updateSyntheticWindow(root, itemId, {
            box: moveBox(window.box, point)
          });
        }
        break;
      }
      break;
    }

    case REMOVED: {
      const { itemId, itemType } = event as Removed;
      if (itemType === SYNTHETIC_WINDOW) {
        return removeSyntheticWindow(root, itemId);
      }

      break;
    }

    case SYNTHETIC_WINDOW_LOADED: {
      const { syntheticWindowId, document, allNodes } = event as SyntheticWindowLoaded;
      return updateSyntheticWindow(root, syntheticWindowId, { document, allNodes });
    }

    case SYNTHETIC_WINDOW_RECTS_UPDATED: {
      const { rects, styles, syntheticWindowId } = event as SyntheticWindowRectsUpdated;
      return updateSyntheticWindow(root, syntheticWindowId, {
        computedBoxes: rects,
        computedStyles: styles
      });
    }

    case SYNTHETIC_WINDOW_RESOURCE_LOADED: {
      const { uri, syntheticWindowId } = event as SyntheticWindowResourceLoaded;
      const window = getSyntheticWindow(root, syntheticWindowId);
      return updateSyntheticWindow(root, syntheticWindowId, {
        externalResourceUris: uniq(window.externalResourceUris, uri)
      });
    }
  }

  return root;
}