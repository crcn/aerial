import { 
  Bounds,
  Moved, 
  MOVED, 
  Mutation,
  moveBounds,
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
  SyntheticWindowChanged,
  SYNTHETIC_WINDOW_SCROLLED,
  SyntheticWindowScrolled,
  syntheticWindowOpened,
  SYNTHETIC_WINDOW_MOVED,
  SYNTHETIC_WINDOW_RESIZED,
  SyntheticWindowRectsUpdated,
  SyntheticWindowSourceChanged,
  OPEN_SYNTHETIC_WINDOW, 
  SYNTHETIC_WINDOW_OPENED,
  SyntheticWindowOpened,
  OpenSyntheticBrowserWindow,
  NewSyntheticWindowEntryResolved,
} from "../actions";
import { 
  SyntheticNode,
  SyntheticWindow,
  SYNTHETIC_WINDOW,
  removeSyntheticWindow,
  isSyntheticNodeType,
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

const getBestWindowBounds = (browser: SyntheticBrowser, bounds: Bounds) => {
  if (!browser.windows.length) return bounds;
  const rightMostWindow = browser.windows.length > 1 ? browser.windows.reduce((a, b) => {
    return a.bounds.right > b.bounds.right ? a : b;
  }) : browser.windows[0];

  return moveBounds(bounds, {
    left: rightMostWindow.bounds.right + WINDOW_PADDING,
    top: rightMostWindow.bounds.top
  });
};


export const syntheticBrowserReducer = <TRootState extends SyntheticBrowserRootState>(root: TRootState = createSyntheticBrowserRootState() as TRootState, event: BaseEvent) => {

  switch(event.type) {
    case SYNTHETIC_WINDOW_OPENED: {
      const { instance, parentWindowId, browserId } = event as SyntheticWindowOpened;
      let syntheticBrowser: SyntheticBrowser;
      syntheticBrowser = getSyntheticBrowser(root, browserId);
      return updateSyntheticBrowser(root, syntheticBrowser.$id, {
        windows: [
          ...syntheticBrowser.windows,
          createSyntheticWindow({
            $id: instance.uid,
            location: instance.location.toString(),
            mount: instance.renderer.mount,
            bounds: {
              left: instance.screenLeft,
              top: instance.screenTop,
              right: instance.screenLeft + instance.innerWidth,
              bottom: instance.screenTop + instance.innerHeight,
            }
          })
        ]
      });
    }
    
    case SYNTHETIC_WINDOW_SCROLLED: {
      const { scrollPosition, syntheticWindowId } = event as SyntheticWindowScrolled;
      return updateSyntheticWindow(root, syntheticWindowId, {
        scrollPosition,
      });
    }

    case SYNTHETIC_WINDOW_RESIZED: 
    case SYNTHETIC_WINDOW_MOVED: {
      const { instance: { uid, screenLeft, screenTop, innerWidth, innerHeight } } = event as SyntheticWindowChanged;
      return updateSyntheticWindow(root, uid, {
        bounds: {
          left: screenLeft,
          top: screenTop,
          right: screenLeft + innerWidth,
          bottom: screenTop + innerHeight,
        }
      });
    }

    case MOVED: {
      const { itemId, itemType, point } = event as Moved;
      if (itemType === SYNTHETIC_WINDOW) {
        const window = getSyntheticWindow(root, itemId);
        if (window) {
          return updateSyntheticWindow(root, itemId, {
            bounds: moveBounds(window.bounds, point)
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
        allComputedBounds: rects,
        allComputedStyles: styles
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