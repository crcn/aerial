import { 
  moved,
  removed,
  resized,
  update,
  Struct,
  moveBox,
  updateIn, 
  Translate,
  BaseEvent, 
  boxFromRect,
  mergeBoxes,
  getPathById, 
  getValueById,
  updateStruct,
  mapImmutable, 
  keepBoxCenter,
  getValueByPath, 
  scaleInnerBox,
  keepBoxAspectRatio,
  centerTransformZoom,
  updateStructProperty, 
} from "aerial-common2";

import { clamp } from "lodash";

import { 
  ApplicationState,
  getWorkspaceById,
  getSelectedWorkspace,
  addWorkspaceSelection,
  removeWorkspaceSelection,
  createApplicationState,
  clearWorkspaceSelection,
  toggleWorkspaceSelection,
  getSelectedWorkspaceFile,
  getWorkspaceSelectionBox,
  getBoxedWorkspaceSelection,
  getSyntheticWindowWorkspace,
} from "front-end/state";

import {
  ResizerMoved,
  RESIZER_MOVED,
  KeyboardShortcutAdded,
  PromptedNewWindowUrl,
  WindowPaneRowClicked,
  WINDOW_PANE_ROW_CLICKED,
  PROMPTED_NEW_WINDOW_URL,
  KEYBOARD_SHORTCUT_ADDED,
  DELETE_SHORCUT_PRESSED,
  DeleteShortcutPressed,
} from "front-end/messages";

import {
  ShortcutServiceState,
} from "front-end/services";

import { 
  syntheticBrowserReducer,
  getSyntheticBrowserWindow,
  OPEN_SYNTHETIC_WINDOW_REQUESTED,
  openSyntheticWindowRequested,
} from "aerial-synthetic-browser";

import { 
  RESIZER_PATH_MOUSE_MOVED,
  ResizerPathMoved,
  TEXT_EDITOR_CHANGED,
  TextEditorChangedEvent,
  CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED,
  CanvasElementsComputedPropsChanged,
  TREE_NODE_LABEL_CLICKED, 
  FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED,
  FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED,
  TreeNodeLabelClickedEvent,
  VISUAL_EDITOR_WHEEL,
  VisualEditorWheel
} from "front-end/components";

import reduceReducers = require("reduce-reducers");

export const applicationReducer = (state = createApplicationState(), event: BaseEvent) => {
  switch(event.type) {
    case TREE_NODE_LABEL_CLICKED: {
      const { node } = event as TreeNodeLabelClickedEvent;
      return updateStructProperty(state, getSelectedWorkspace(state), "selectedFileId", node.$$id);
    }

    case TEXT_EDITOR_CHANGED: {
      const { file, value } = event as TextEditorChangedEvent;
      const path = getPathById(state, file.$$id);
      return updateStructProperty(state, file, "content", value);
    }

    case FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED: {
      const changedEvent = event as TextEditorChangedEvent;
      break;
    }

    case FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED: {
      const changedEvent = event as TextEditorChangedEvent;
      break;
    }
  }

  state = canvasReducer(state, event);
  state = syntheticBrowserReducer(state, event);
  state = visualEditorReducer(state, event);
  state = windowPaneReducer(state, event);
  state = shortcutServiceReducer(state, event);

  return state;
};

const canvasReducer = (state: ApplicationState, event: BaseEvent) => {
  switch(event.type) {
    case CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED: {
      const { computedStyles, computedBoxes, syntheticWindowId } = event as CanvasElementsComputedPropsChanged;
      const window = getSyntheticBrowserWindow(state, syntheticWindowId);
      return updateStruct(state, window, {
        ...window,
        computedBoxes,
        computedStyles
      });
    }
  }

  return state;
};

const PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
const ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 6400 / 100;


const visualEditorReducer = (state: ApplicationState, event: BaseEvent) => {

  switch(event.type) {
    case VISUAL_EDITOR_WHEEL: {
      const { workspaceId, metaKey, ctrlKey, deltaX, deltaY, mouseX, mouseY, canvasHeight, canvasWidth } = event as VisualEditorWheel;
      const workspace = getWorkspaceById(state, workspaceId);
      let translate = workspace.visualEditorSettings.translate;

      if (metaKey || ctrlKey) {
        translate = centerTransformZoom(translate, boxFromRect({
          width: canvasWidth,
          height: canvasHeight
        }), clamp(translate.zoom + translate.zoom * deltaY / ZOOM_SENSITIVITY, MIN_ZOOM, MAX_ZOOM), { left: mouseX, top: mouseY });

      } else {
        translate = {
          ...translate,
          left: translate.left - deltaX,
          top: translate.top - deltaY
        };
      }

      return updateStructProperty(state, workspace, "visualEditorSettings", {
        ...workspace.visualEditorSettings,
        translate: translate
      });
    }

    case RESIZER_PATH_MOUSE_MOVED: {
      let { workspaceId, anchor, box: newBounds, sourceEvent } = event as ResizerPathMoved;
      const workspace = getWorkspaceById(state, workspaceId);

      // TODO - possibly use BoxStruct instead of Box since there are cases where box prop doesn't exist
      const bounds = getWorkspaceSelectionBox(workspace);

      const keepAspectRatio = sourceEvent.shiftKey;
      const keepCenter      = sourceEvent.altKey;

      if (keepCenter) {
        // newBounds = keepBoxCenter(newBounds, bounds, anchor);
      }

      if (keepAspectRatio) {
        newBounds = keepBoxAspectRatio(newBounds, bounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
      }

      for (const item of getBoxedWorkspaceSelection(workspace)) {
        const scaledBox = scaleInnerBox(item.box, bounds, newBounds);
        state = applicationReducer(state, resized(item.$$id, item.$$type, scaleInnerBox(item.box, bounds, newBounds)));
      }
      return state;
    }
    
    case RESIZER_MOVED: {
      const { point, workspaceId, point: newPoint } = event as ResizerMoved;
      const workspace = getWorkspaceById(state, workspaceId);
      const translate = workspace.visualEditorSettings.translate;
      const bounds = getWorkspaceSelectionBox(workspace);
      for (const item of getBoxedWorkspaceSelection(workspace)) {
        state = applicationReducer(state, moved(item.$$id, item.$$type, scaleInnerBox(item.box, bounds, moveBox(bounds, newPoint))));
      }
      return state;
    }

    case PROMPTED_NEW_WINDOW_URL: {
      const { workspaceId, location } = event as PromptedNewWindowUrl;
      return applicationReducer(state, openSyntheticWindowRequested(getWorkspaceById(state, workspaceId).browser.$$id, location));
    }

    case DELETE_SHORCUT_PRESSED: {
      const { sourceEvent } = event as DeleteShortcutPressed;
      const workspace = getSelectedWorkspace(state);
      const selected  = workspace.selectionIds.map(id => getValueById(state, id)) as Struct[];
      for (const item of selected) {
        state = applicationReducer(state, removed(item.$$id, item.$$type));
      }
      state = clearWorkspaceSelection(state, workspace.$$id);
    }
  }

  return state;
}

const windowPaneReducer = (state: ApplicationState, event: BaseEvent) => {
  switch (event.type) {
    case WINDOW_PANE_ROW_CLICKED: {
      const { windowId, sourceEvent } = event as WindowPaneRowClicked;
      const workspace = getSyntheticWindowWorkspace(state, windowId);
      return sourceEvent.metaKey || sourceEvent.ctrlKey ? addWorkspaceSelection(state, workspace.$$id, windowId) : toggleWorkspaceSelection(state, workspace.$$id, windowId);
    }
  }
  return state;
};


const shortcutServiceReducer = <T extends ShortcutServiceState>(state: ApplicationState, event: BaseEvent) => {
  switch(event.type) {
    case KEYBOARD_SHORTCUT_ADDED: {
      const { keyCombo, action } = event as KeyboardShortcutAdded;
      return update(state, "shortcuts", [...(state.shortcuts || []), { keyCombo, action }]);
    }
  }
  return state;
}