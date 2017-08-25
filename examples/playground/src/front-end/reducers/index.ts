import { 
  Bounds,
  IDd,
  moved,
  removed,
  resized,
  update,
  Struct,
  moveBounds,
  zoomBounds,
  updateIn, 
  Translate,
  BaseEvent, 
  WrappedEvent,
  boundsFromRect,
  getBoundsSize,
  mergeBounds,
  mapImmutable, 
  keepBoundsCenter,
  getSmallestBounds,
  scaleInnerBounds,
  boundsIntersect,
  StructReference,
  getStructReference,
  pointIntersectsBounds,
  keepBoundsAspectRatio,
  centerTransformZoom,
} from "aerial-common2";

import { clamp } from "lodash";
import { fileCacheReducer, getFileCacheItemByUri, FileCacheItem, updateFileCacheItem } from "aerial-sandbox2";

import { 
  Workspace,
  ApplicationState,
  updateWorkspace,
  getWorkspaceById,
  getStageTranslate,
  ShortcutServiceState,
  updateWorkspaceStage,
  getSelectedWorkspace,
  addWorkspaceSelection,
  setWorkspaceSelection,
  getSyntheticBrowserItemBounds,
  createApplicationState,
  getFrontEndItemByReference,
  clearWorkspaceSelection,
  removeWorkspaceSelection,
  toggleWorkspaceSelection,
  showWorkspaceTextEditor,
  getSelectedWorkspaceFile,
  getWorkspaceSelectionBounds,
  getSyntheticNodeWorkspace,
  getSyntheticBrowserBounds,
  getBoundedWorkspaceSelection,
  getSyntheticWindowWorkspace,
  getStageToolMouseNodeTargetReference,
} from "front-end/state";

import {
  StageToolOverlayMouseMoved,
  StageToolOverlayClicked,
  STAGE_MOUNTED,
  StageMounted,
  TOGGLE_TEXT_EDITOR_PRESSED,
  StageToolEditTextChanged,
  STAGE_TOOL_EDIT_TEXT_CHANGED,
  STAGE_TOOL_OVERLAY_MOUSE_PAN_END,
  STAGE_TOOL_OVERLAY_MOUSE_LEAVE,
  RESIZER_PATH_MOUSE_STOPPED_MOVING,
  STAGE_TOOL_OVERLAY_MOUSE_PAN_START,
  StageToolOverlayMousePanStart,
  STAGE_MOUSE_MOVED,
  RESIZER_STOPPED_MOVING,
  StageToolOverlayMousePanEnd,
  SELECTOR_DOUBLE_CLICKED,
  SelectorDoubleClicked,
  WorkspaceSelectionDeleted,
  WORKSPACE_DELETION_SELECTED,
  STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
  STAGE_MOUSE_CLICKED,
  StageToolNodeOverlayHoverOut,
  StageToolNodeOverlayHoverOver,
  StageToolNodeOverlayClicked,
  STAGE_TOOL_WINDOW_KEY_DOWN,
  ZOOM_IN_SHORTCUT_PRESSED,
  ZOOM_OUT_SHORTCUT_PRESSED,
  STAGE_TOOL_SELECTION_KEY_DOWN,
  StageToolSelectionKeyDown,
  RESIZER_MOUSE_DOWN,
  ResizerMouseDown,
  STAGE_TOOL_WINDOW_BACKGROUND_CLICKED,
  StageWillWindowKeyDown,
  keyboardShortcutAdded,
  CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED,
  CanvasElementsComputedPropsChanged,
  ResizerPathMoved,
  FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED,
  FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED,
  StageWillWindowTitleClicked,
  STAGE_TOOL_WINDOW_TITLE_CLICKED,
  RESIZER_PATH_MOUSE_MOVED,
  ResizerMoved,
  RESIZER_MOVED,
  KeyboardShortcutAdded,
  TOGGLE_LEFT_GUTTER_PRESSED,
  TOGGLE_RIGHT_GUTTER_PRESSED,
  PromptedNewWindowUrl,
  TREE_NODE_LABEL_CLICKED,
  TreeNodeLabelClicked,
  WindowPaneRowClicked,
  WINDOW_PANE_ROW_CLICKED,
  FULL_SCREEN_SHORTCUT_PRESSED,
  PROMPTED_NEW_WINDOW_URL,
  KEYBOARD_SHORTCUT_ADDED,
  DELETE_SHORCUT_PRESSED,
  ESCAPE_SHORTCUT_PRESSED,
  DeleteShortcutPressed,
  VISUAL_EDITOR_WHEEL,
  StageWheel,
} from "front-end/actions";

import { 
  SyntheticNode,
  getSyntheticWindow, 
  getSyntheticBrowser,
  SYNTHETIC_WINDOW,
  syntheticBrowserReducer, 
  openSyntheticWindowRequest,
  getSyntheticNodeWindow,
  getSyntheticNodeById,
  SYNTHETIC_WINDOW_PROXY_OPENED,
  SyntheticWindowOpened,
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
      if (workspace.stage.fullScreenWindowId) return state;
      return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) * 2);
    }

    case ZOOM_OUT_SHORTCUT_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      if (workspace.stage.fullScreenWindowId) return state;
      return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) / 2);
    }

    case ESCAPE_SHORTCUT_PRESSED: {
      return clearWorkspaceSelection(state, state.selectedWorkspaceId);
    }

    case FULL_SCREEN_SHORTCUT_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      const selection = workspace.selectionRefs[0];

      const windowId = selection ? selection[0] === SYNTHETIC_WINDOW ? selection[1] : getSyntheticNodeWindow(state, selection[1]).$id : null;

      if (windowId && !workspace.stage.fullScreenWindowId) {
        return updateWorkspaceStage(state, workspace.$id, {
          smooth: true,
          fullScreenWindowId: windowId,
        });
      } else if (workspace.stage.fullScreenWindowId) {
        return updateWorkspaceStage(state, workspace.$id, {
          smooth: true,
          fullScreenWindowId: undefined
        });
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

      if (workspace.stage.fullScreenWindowId) {
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
      const workspace = getSelectedWorkspace(state);
      if (!workspace.stage.container) return state;

      const { width, height } = workspace.stage.container.getBoundingClientRect();

      state = centerStage(state, state.selectedWorkspaceId, {
        left: instance.screenLeft,
        top: instance.screenTop,
        right: instance.screenLeft + instance.innerWidth,
        bottom: instance.screenTop + instance.innerHeight,
      }, true);

      if (workspace.stage.fullScreenWindowId) {
        state = updateWorkspaceStage(state, workspace.$id, {
          smooth: true,
          fullScreenWindowId: instance.$id
        });
      } else {
        state = setWorkspaceSelection(state, workspace.$id, getStructReference(instance.struct));
      }

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
      return centerStage(state, workspaceId, innerBounds);
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

const centerStage = (state: ApplicationState, workspaceId: string, innerBounds: Bounds, smooth?: boolean) => {
  const workspace = getWorkspaceById(state, workspaceId);
  const { stage: { container }} = workspace;
  if (!container) return state;

  const { width, height } = container.getBoundingClientRect();

  const innerSize = getBoundsSize(innerBounds);

  const centered = {
    left: -innerBounds.left + width / 2 - (innerSize.width) / 2,
    top: -innerBounds.top + height / 2 - (innerSize.height) / 2,
  };

  const scale = Math.min(
    (width - INITIAL_ZOOM_PADDING) / innerSize.width,
    (height - INITIAL_ZOOM_PADDING) / innerSize.height
  );

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
  return sourceEvent.metaKey || sourceEvent.ctrlKey ? toggleWorkspaceSelection(state, workspace.$id, ref) : setWorkspaceSelection(state, workspace.$id, ref);
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
  if (!workspace.stage.fullScreenWindowId && workspace.stage.smooth) {
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
