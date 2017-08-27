import { 
  IDd,
  moved,
  update,
  Bounds,
  Struct,
  removed,
  resized,
  updateIn, 
  Translate,
  BaseEvent, 
  zoomBounds,
  moveBounds,
  mergeBounds,
  mapImmutable, 
  WrappedEvent,
  getBoundsSize,
  boundsFromRect,
  boundsIntersect,
  StructReference,
  scaleInnerBounds,
  keepBoundsCenter,
  getSmallestBounds,
  getStructReference,
  centerTransformZoom,
  pointIntersectsBounds,
  keepBoundsAspectRatio,
} from "aerial-common2";

import { clamp } from "lodash";
import { 
  FileCacheItem, 
  fileCacheReducer,
  updateFileCacheItem,
  getFileCacheItemByUri, 
} from "aerial-sandbox2";

import { 
  Workspace,
  updateWorkspace,
  getWorkspaceById,
  ApplicationState,
  getStageTranslate,
  ShortcutServiceState,
  updateWorkspaceStage,
  getSelectedWorkspace,
  addWorkspaceSelection,
  setWorkspaceSelection,
  createApplicationState,
  showWorkspaceTextEditor,
  clearWorkspaceSelection,
  removeWorkspaceSelection,
  toggleWorkspaceSelection,
  getSelectedWorkspaceFile,
  getSyntheticNodeWorkspace,
  getSyntheticBrowserBounds,
  getFrontEndItemByReference,
  getWorkspaceSelectionBounds,
  getSyntheticWindowWorkspace,
  getBoundedWorkspaceSelection,
  getSyntheticBrowserItemBounds,
  getStageToolMouseNodeTargetReference,
} from "front-end/state";

import {
  StageWheel,
  StageMounted,
  ResizerMoved,
  RESIZER_MOVED,
  STAGE_MOUNTED,
  ResizerMouseDown,
  ResizerPathMoved,
  STAGE_MOUSE_MOVED,
  RESIZER_MOUSE_DOWN,
  STAGE_MOUSE_CLICKED,
  VISUAL_EDITOR_WHEEL,
  PromptedNewWindowUrl,
  TreeNodeLabelClicked,
  WindowPaneRowClicked,
  SelectorDoubleClicked,
  DeleteShortcutPressed,
  KeyboardShortcutAdded,
  keyboardShortcutAdded,
  StageWillWindowKeyDown,
  DELETE_SHORCUT_PRESSED,
  PROMPTED_NEW_WINDOW_URL,
  KEYBOARD_SHORTCUT_ADDED,
  ESCAPE_SHORTCUT_PRESSED,
  RESIZER_STOPPED_MOVING,
  SELECTOR_DOUBLE_CLICKED,
  StageToolOverlayClicked,
  TREE_NODE_LABEL_CLICKED,
  WINDOW_PANE_ROW_CLICKED,
  RESIZER_PATH_MOUSE_MOVED,
  StageToolEditTextChanged,
  ZOOM_IN_SHORTCUT_PRESSED,
  WorkspaceSelectionDeleted,
  ZOOM_OUT_SHORTCUT_PRESSED,
  StageToolSelectionKeyDown,
  STAGE_TOOL_WINDOW_KEY_DOWN,
  TOGGLE_LEFT_GUTTER_PRESSED,
  StageToolOverlayMouseMoved,
  TOGGLE_TEXT_EDITOR_PRESSED,
  WORKSPACE_DELETION_SELECTED,
  StageWillWindowTitleClicked,
  TOGGLE_RIGHT_GUTTER_PRESSED,
  StageToolOverlayMousePanEnd,
  StageToolNodeOverlayClicked,
  FULL_SCREEN_SHORTCUT_PRESSED,
  StageToolNodeOverlayHoverOut,
  STAGE_TOOL_EDIT_TEXT_CHANGED,
  StageToolNodeOverlayHoverOver,
  STAGE_TOOL_SELECTION_KEY_DOWN,
  StageToolOverlayMousePanStart,
  STAGE_TOOL_OVERLAY_MOUSE_LEAVE,
  STAGE_TOOL_WINDOW_TITLE_CLICKED,
  STAGE_TOOL_OVERLAY_MOUSE_PAN_END,
  RESIZER_PATH_MOUSE_STOPPED_MOVING,
  STAGE_TOOL_OVERLAY_MOUSE_PAN_START,
  CanvasElementsComputedPropsChanged,
  STAGE_TOOL_WINDOW_BACKGROUND_CLICKED,
  CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED,
  FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED,
  STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
  FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED,
} from "front-end/actions";

import { 
  SyntheticNode,
  SYNTHETIC_WINDOW,
  getSyntheticWindow, 
  getSyntheticBrowser,
  getSyntheticNodeById,
  SyntheticWindowOpened,
  getSyntheticNodeWindow,
  syntheticBrowserReducer, 
  openSyntheticWindowRequest,
  SYNTHETIC_WINDOW_PROXY_OPENED,
} from "aerial-browser-sandbox";

import reduceReducers = require("reduce-reducers");

export const applicationReducer = (state: ApplicationState = createApplicationState(), event: BaseEvent) => {
  switch(event.type) {
    case TREE_NODE_LABEL_CLICKED: {
      const { node } = event as TreeNodeLabelClicked;
      return updateWorkspace(state, state.selectedWorkspaceId, {
        selectedFileId: node.$id
      });
    }
  }
  
  // state = canvasReducer(state, event);
  // state = syntheticBrowserReducer(state, event);
  state = syntheticBrowserReducer(state, event);
  state = stageReducer(state, event);
  state = windowPaneReducer(state, event);
  state = shortcutServiceReducer(state, event);
  state = fileCacheReducer(state, event);
  state = shortcutReducer(state, event);

  return state;
};

const PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
const ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;
const MIN_ZOOM = 0.02;
const MAX_ZOOM = 6400 / 100;
const INITIAL_ZOOM_PADDING = 50;

const shortcutReducer = (state: ApplicationState, event: BaseEvent) => {
  switch(event.type) {

    case TOGGLE_LEFT_GUTTER_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      return updateWorkspaceStage(state, workspace.$id, {
        showLeftGutter: !workspace.stage.showLeftGutter
      });
    }

    case ZOOM_IN_SHORTCUT_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      if (workspace.stage.fullScreen) return state;
      return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) * 2);
    }

    case ZOOM_OUT_SHORTCUT_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      if (workspace.stage.fullScreen) return state;
      return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) / 2);
    }

    case ESCAPE_SHORTCUT_PRESSED: {
      return clearWorkspaceSelection(state, state.selectedWorkspaceId);
    }

    case FULL_SCREEN_SHORTCUT_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      const selection = workspace.selectionRefs[0];

      const windowId = selection ? selection[0] === SYNTHETIC_WINDOW ? selection[1] : getSyntheticNodeWindow(state, selection[1]).$id : null;

      if (windowId && !workspace.stage.fullScreen) {
        const window = getSyntheticWindow(state, windowId);
        state = updateWorkspaceStage(state, workspace.$id, {
          smooth: true,
          fullScreen: {
            windowId: windowId,
            originalTranslate: workspace.stage.translate,
            originalWindowBounds: window.bounds
          },
          translate: {
            zoom: 1,
            left: -window.bounds.left,
            top: -window.bounds.top
          }
        });
        return state;
      } else if (workspace.stage.fullScreen) {
        const { originalWindowBounds } = workspace.stage.fullScreen;
        state = updateWorkspaceStage(state, workspace.$id, {
          smooth: true,
          fullScreen: undefined
        });
        
        state = updateWorkspaceStage(state, workspace.$id, {
          translate: workspace.stage.fullScreen.originalTranslate,
          smooth: true
        });
        
        return state;
      } else {
        return state;
      }
    }
    
    case TOGGLE_TEXT_EDITOR_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      return updateWorkspaceStage(state, workspace.$id, {
        showTextEditor: !workspace.stage.showTextEditor
      });
    }

    case TOGGLE_RIGHT_GUTTER_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      return updateWorkspaceStage(state, workspace.$id, {
        showRightGutter: !workspace.stage.showRightGutter
      });
    }
  }
  return state;
}

const stageReducer = (state: ApplicationState, event: BaseEvent) => {

  switch(event.type) {
    case VISUAL_EDITOR_WHEEL: {
      const { workspaceId, metaKey, ctrlKey, deltaX, deltaY, canvasHeight, canvasWidth } = event as StageWheel;
      const workspace = getWorkspaceById(state, workspaceId);

      if (workspace.stage.fullScreen) {
        return state;
      }
      
      let translate = getStageTranslate(workspace.stage);

      if (metaKey || ctrlKey) {
        translate = centerTransformZoom(translate, boundsFromRect({
          width: canvasWidth,
          height: canvasHeight
        }), clamp(translate.zoom + translate.zoom * deltaY / ZOOM_SENSITIVITY, MIN_ZOOM, MAX_ZOOM), workspace.stage.mousePosition);
      } else {
        translate = {
          ...translate,
          left: translate.left - deltaX,
          top: translate.top - deltaY
        };
      }

      return updateWorkspaceStage(state, workspace.$id, { smooth: false, translate });
    }

    case RESIZER_PATH_MOUSE_MOVED: 
    case RESIZER_MOVED: {
      const workspace = getSelectedWorkspace(state);
      state = updateWorkspaceStage(state, workspace.$id, {
        smooth: false,
        movingOrResizing: true
      });
      return state;
    }

    case RESIZER_PATH_MOUSE_STOPPED_MOVING: 
    case RESIZER_STOPPED_MOVING: {
      const workspace = getSelectedWorkspace(state);
      state = updateWorkspaceStage(state, workspace.$id, {
        smooth: false,
        movingOrResizing: false
      });
      return state;
    }

    case SYNTHETIC_WINDOW_PROXY_OPENED: {
      const { instance } = event as SyntheticWindowOpened;
      let workspace = getSelectedWorkspace(state);
      if (!workspace.stage.container) return state;

      const { width, height } = workspace.stage.container.getBoundingClientRect();

      const windowBounds = {
        left: instance.screenLeft,
        top: instance.screenTop,
        right: instance.screenLeft + instance.innerWidth,
        bottom: instance.screenTop + instance.innerHeight,
      };

      state = centerStage(state, state.selectedWorkspaceId, windowBounds, true, workspace.stage.fullScreen && workspace.stage.fullScreen.originalTranslate.zoom);

      // update translate
      workspace = getSelectedWorkspace(state);

      if (workspace.stage.fullScreen) {

        state = updateWorkspaceStage(state, workspace.$id, {
          smooth: true,
          fullScreen: {
            windowId: instance.$id,
            originalTranslate: workspace.stage.translate,
            originalWindowBounds: windowBounds
          },
          translate: {
            zoom: 1,
            left: -windowBounds.left,
            top: -windowBounds.top
          }
        });
      }

      state = setWorkspaceSelection(state, workspace.$id, getStructReference(instance.struct));

      return state;
    }

    case STAGE_TOOL_OVERLAY_MOUSE_LEAVE: {
      const { sourceEvent } = event as StageToolOverlayMouseMoved;
      return updateWorkspace(state, state.selectedWorkspaceId, {
        hoveringRefs: []
      });
    }

    case RESIZER_MOUSE_DOWN: {
      const { sourceEvent, workspaceId } = event as ResizerMouseDown;
      const metaKey = sourceEvent.metaKey || sourceEvent.ctrlKey;
      const workspace = getWorkspaceById(state, workspaceId);

      if (metaKey && workspace.selectionRefs.length === 1) {
        state = setSelectedFileFromNodeId(state, workspace.$id, workspace.selectionRefs[0][1]);
      }

      state = updateWorkspaceStage(state, workspace.$id, {
        smooth: false
      });

      return state;
    }

    case STAGE_MOUNTED: {
      const { element } = event as StageMounted;
      const { width, height } = element.getBoundingClientRect();
      const workspaceId = state.selectedWorkspaceId;
      const workspace = getSelectedWorkspace(state);
      state = updateWorkspaceStage(state, workspaceId, { container: element });
      const innerBounds = getSyntheticBrowserBounds(getSyntheticBrowser(state, workspace.browserId));
      return centerStage(state, workspaceId, innerBounds, false, true);
    };

    case STAGE_TOOL_OVERLAY_MOUSE_PAN_START: {
      const { windowId } = event as StageToolOverlayMousePanStart;
      const workspace = getSyntheticWindowWorkspace(state, windowId);
      return updateWorkspaceStage(state, workspace.$id, { panning: true });
    }
    
    case STAGE_TOOL_OVERLAY_MOUSE_PAN_END: {
      const { windowId } = event as StageToolOverlayMousePanEnd;
      const workspace = getSyntheticWindowWorkspace(state, windowId)
      return updateWorkspaceStage(state, workspace.$id, { panning: false });
    }

    case STAGE_MOUSE_MOVED: {
      const { sourceEvent: { pageX, pageY }} = event as WrappedEvent<React.MouseEvent<any>>;
      state = updateWorkspaceStage(state, state.selectedWorkspaceId, {
        mousePosition: {
          left: pageX,
          top: pageY
        }
      });

      const workspace = getSelectedWorkspace(state);

      // TODO - in the future, we'll probably want to be able to highlight hovered nodes as the user is moving an element around to indicate where
      // they can drop the element. 
      const targetRef = workspace.stage.movingOrResizing ? null : getStageToolMouseNodeTargetReference(state, event as StageToolOverlayMouseMoved);

      state = updateWorkspace(state, state.selectedWorkspaceId, {
        hoveringRefs: targetRef ? [targetRef] : []
      });

      return state;
    };

    case STAGE_MOUSE_CLICKED: {
      const { sourceEvent } = event as StageToolNodeOverlayClicked;
      if (/textarea|input/i.test((sourceEvent.target as Element).nodeName)) {
        return state;
      }
      const metaKey = sourceEvent.metaKey || sourceEvent.ctrlKey;

      // alt key opens up a new link
      const altKey = sourceEvent.altKey;
      const workspace = getSelectedWorkspace(state);
      state = updateWorkspaceStageSmoothing(state, workspace);
      
      // do not allow selection while window is panning (scrolling)
      if (workspace.stage.panning || workspace.stage.movingOrResizing) return state;

      const targetRef = getStageToolMouseNodeTargetReference(state, event as StageToolNodeOverlayClicked);
      if (!targetRef) {
        return state;
      }
      if (metaKey) {
        return setSelectedFileFromNodeId(state, workspace.$id, targetRef[1]);
      } else if (!altKey) {
        state = handleWindowSelectionFromAction(state, targetRef, event as StageToolNodeOverlayClicked);
        state = updateWorkspace(state, workspace.$id, {
          secondarySelection: false
        });
        return state;
      }
      return state;
    }

    case STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED: {
      const { sourceEvent, windowId } = event as StageToolNodeOverlayClicked;
      const workspace = getSyntheticWindowWorkspace(state, windowId);
      const targetRef = getStageToolMouseNodeTargetReference(state, event as StageToolNodeOverlayClicked);
      if (!targetRef) return state;      

      state = updateWorkspace(state, workspace.$id, {
        secondarySelection: true
      });

      state = setWorkspaceSelection(state, workspace.$id, targetRef);

      return state;
    }

    case SELECTOR_DOUBLE_CLICKED: {
      const { sourceEvent, item } = event as SelectorDoubleClicked;
      const workspace = getSyntheticNodeWorkspace(state, item.$id);
      state = updateWorkspace(state, workspace.$id, {
        secondarySelection: true
      });
      state = setWorkspaceSelection(state, workspace.$id, getStructReference(item));
      return state;
    }
    case WORKSPACE_DELETION_SELECTED: {
      const { workspaceId } = event as WorkspaceSelectionDeleted;
      return clearWorkspaceSelection(state, workspaceId);
    }

    case STAGE_TOOL_WINDOW_TITLE_CLICKED: {
      state = updateWorkspaceStageSmoothing(state);
      return handleWindowSelectionFromAction(state, getStructReference(getSyntheticWindow(state, (event as WindowPaneRowClicked).windowId)), event as WindowPaneRowClicked);
    }

    case STAGE_TOOL_WINDOW_BACKGROUND_CLICKED: {
      const workspace = getSelectedWorkspace(state);
      return clearWorkspaceSelection(state, workspace.$id);
    }
  }

  return state;
}

const centerStage = (state: ApplicationState, workspaceId: string, innerBounds: Bounds, smooth?: boolean, zoomOrZoomToFit?: boolean|number) => {
  const workspace = getWorkspaceById(state, workspaceId);
  const { stage: { container, translate }} = workspace;
  if (!container) return state;

  const { width, height } = container.getBoundingClientRect();

  const innerSize = getBoundsSize(innerBounds);

  const centered = {
    left: -innerBounds.left + width / 2 - (innerSize.width) / 2,
    top: -innerBounds.top + height / 2 - (innerSize.height) / 2,
  };

  const scale = typeof zoomOrZoomToFit === "boolean" ? Math.min(
    (width - INITIAL_ZOOM_PADDING) / innerSize.width,
    (height - INITIAL_ZOOM_PADDING) / innerSize.height
  ) : typeof zoomOrZoomToFit === "number" ? zoomOrZoomToFit : translate.zoom;

  return updateWorkspaceStage(state, workspaceId, {
    smooth,
    translate: centerTransformZoom({
      ...centered,
      zoom: 1
    }, { left: 0, top: 0, right: width, bottom: height }, scale)
  });
}

const handleWindowSelectionFromAction = <T extends { sourceEvent: React.MouseEvent<any>, windowId }>(state: ApplicationState, ref: StructReference, event: T) => {
  const { sourceEvent } = event;
  const workspace = getSelectedWorkspace(state);
  return sourceEvent.metaKey || sourceEvent.ctrlKey ? addWorkspaceSelection(state, workspace.$id, ref) : setWorkspaceSelection(state, workspace.$id, ref);
}

const normalizeZoom = (zoom) => {
  return (zoom < 1 ? 1 / Math.round(1 / zoom) : Math.round(zoom));
};

const windowPaneReducer = (state: ApplicationState, event: BaseEvent) => {
  switch (event.type) {
    case WINDOW_PANE_ROW_CLICKED: {
      return handleWindowSelectionFromAction(state, getStructReference(getSyntheticWindow(state, (event as WindowPaneRowClicked).windowId)), event as WindowPaneRowClicked);
    }
  }
  return state;
};

const updateWorkspaceStageSmoothing = (state: ApplicationState, workspace?: Workspace) => {
  if (!workspace) workspace = getSelectedWorkspace(state);
  if (!workspace.stage.fullScreen && workspace.stage.smooth) {
    return updateWorkspaceStage(state, workspace.$id, {
      smooth: false
    });
  }
  return state;
};

const setStageZoom = (state: ApplicationState, workspaceId: string, zoom: number, smooth: boolean = true) => {
  const workspace = getWorkspaceById(state, workspaceId);
  return updateWorkspaceStage(state, workspace.$id, {
    smooth,
    translate: centerTransformZoom(
      workspace.stage.translate, workspace.stage.container.getBoundingClientRect(), 
      clamp(zoom, MIN_ZOOM, MAX_ZOOM),
      workspace.stage.mousePosition
    )
  });
};

const setSelectedFileFromNodeId = (state: ApplicationState, workspaceId: string, nodeId: string) => {
  const { source: { uri, start } } = getSyntheticNodeById(state, nodeId) as SyntheticNode;
  const fileCacheItem = getFileCacheItemByUri(state, uri);
  if (fileCacheItem) {
    return showWorkspaceTextEditor(updateWorkspace(state, workspaceId, {
      textCursorPosition: start,
      selectedFileId: fileCacheItem.$id,
    }), workspaceId);
  }
  return state;
}
const shortcutServiceReducer = <T extends ShortcutServiceState>(state: ApplicationState, event: BaseEvent) => {
  switch(event.type) {
    case KEYBOARD_SHORTCUT_ADDED: {
      const { keyCombo, action } = event as KeyboardShortcutAdded;
      return update(state, "shortcuts", [...(state.shortcuts || []), { keyCombo, action }]);
    }
  }
  return state;
}
