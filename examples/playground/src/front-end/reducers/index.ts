import { 
  Box,
  IDd,
  moved,
  removed,
  resized,
  update,
  Struct,
  moveBox,
  zoomBox,
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
  getSmallestBox,
  scaleInnerBox,
  boxesIntersect,
  pointIntersectsBox,
  keepBoxAspectRatio,
  centerTransformZoom,
  updateStructProperty, 
} from "aerial-common2";

import { clamp } from "lodash";
import { fileCacheReducer, getFileCache, getFileCacheItemByUri } from "aerial-sandbox2";

import { 
  addWorkspaceHovering,
  removeWorkspaceHovering,
  ApplicationState,
  getWorkspaceById,
  ShortcutServiceState,
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
  StageToolOverlayMouseMoved,
  StageToolOverlayClicked,
  STAGE_TOOL_OVERLAY_MOUSE_CLICKED,
  STAGE_TOOL_OVERLAY_MOUSE_MOVED,
  StageToolNodeOverlayHoverOut,
  StageToolNodeOverlayHoverOver,
  StageToolNodeOverlayClicked,
  STAGE_TOOL_WINDOW_KEY_DOWN,
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
  TEXT_EDITOR_CHANGED,
  textEditorChanged,
  TOGGLE_LEFT_GUTTER_PRESSED,
  TOGGLE_RIGHT_GUTTER_PRESSED,
  PromptedNewWindowUrl,
  TREE_NODE_LABEL_CLICKED,
  TreeNodeLabelClickedEvent,
  WindowPaneRowClicked,
  WINDOW_PANE_ROW_CLICKED,
  PROMPTED_NEW_WINDOW_URL,
  KEYBOARD_SHORTCUT_ADDED,
  DELETE_SHORCUT_PRESSED,
  DeleteShortcutPressed,
  VISUAL_EDITOR_WHEEL,
  VisualEditorWheel,
} from "front-end/actions";

import { 
  SyntheticNode,
  getSyntheticWindow, 
  syntheticBrowserReducer, 
  createOpenSyntheticWindowRequest
} from "aerial-browser-sandbox";

import reduceReducers = require("reduce-reducers");

export const applicationReducer = (state: ApplicationState = createApplicationState(), event: BaseEvent) => {
  switch(event.type) {
    case TREE_NODE_LABEL_CLICKED: {
      const { node } = event as TreeNodeLabelClickedEvent;
      return updateStructProperty(state, getSelectedWorkspace(state), "selectedFileId", node.$$id);
    }

    case TEXT_EDITOR_CHANGED: {
      const { file, value } = event as textEditorChanged;
      return updateStructProperty(state, file, "content", value);
    }

    case FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED: {
      const changedEvent = event as textEditorChanged;
      break;
    }

    case FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED: {
      const changedEvent = event as textEditorChanged;
      break;
    }
  }
  
  // state = canvasReducer(state, event);
  // state = syntheticBrowserReducer(state, event);
  state = syntheticBrowserReducer(state, event);
  state = visualEditorReducer(state, event);
  state = windowPaneReducer(state, event);
  state = shortcutServiceReducer(state, event);
  state.fileCache = fileCacheReducer(state.fileCache, event);

  return state;
};

// const canvasReducer = (state: ApplicationState, event: BaseEvent) => {
//   switch(event.type) {
//     case CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED: {
//       const { computedStyles, computedBoxes, syntheticWindowId } = event as CanvasElementsComputedPropsChanged;
//       const window = getSyntheticBrowserWindow(state, syntheticWindowId);
//       return updateStruct(state, window, {
//         ...window,
//         computedBoxes,
//         computedStyles
//       });
//     }
//   }

//   return state;
// };

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
      return applicationReducer(state, createOpenSyntheticWindowRequest(location, getWorkspaceById(state, workspaceId).browser.$$id));
    }

    case TOGGLE_LEFT_GUTTER_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      return updateStructProperty(state, workspace, "visualEditorSettings", {
        ...workspace.visualEditorSettings,
        showLeftGutter: !workspace.visualEditorSettings.showLeftGutter
      });
    }

    case STAGE_TOOL_OVERLAY_MOUSE_MOVED: {
      const { sourceEvent, windowId } = event as StageToolOverlayMouseMoved;
      const workspace = getSyntheticWindowWorkspace(state, windowId);
      return updateStructProperty(state, workspace, "hoveringIds", [getStageToolMouseNodeTargetUID(state, event as StageToolOverlayMouseMoved)]);
    }

    case STAGE_TOOL_OVERLAY_MOUSE_CLICKED: {
      const { sourceEvent, windowId } = event as StageToolNodeOverlayClicked;
      const metaKey = sourceEvent.metaKey || sourceEvent.ctrlKey;
      const workspace = getSyntheticWindowWorkspace(state, windowId);
      const targetUID = getStageToolMouseNodeTargetUID(state, event as StageToolNodeOverlayClicked);
      if (metaKey) {
        const { source: { uri, start } } = getValueById(state, targetUID) as SyntheticNode;
        const fileCacheItem = getFileCacheItemByUri(state.fileCache, uri);
        if (fileCacheItem) {
          return updateStructProperty(state, workspace, "selectedFileId", fileCacheItem.$$id);
        }
        return state;
      } else {
        return handleWindowSelectionFromAction(state, targetUID, event as StageToolNodeOverlayClicked);
      }
    }

    case TOGGLE_RIGHT_GUTTER_PRESSED: {
      const workspace = getSelectedWorkspace(state);
      return updateStructProperty(state, workspace, "visualEditorSettings", {
        ...workspace.visualEditorSettings,
        showRightGutter: !workspace.visualEditorSettings.showRightGutter
      });
    }

    case DELETE_SHORCUT_PRESSED: {
      const { sourceEvent } = event as DeleteShortcutPressed;
      const workspace = getSelectedWorkspace(state);
      const selected  = workspace.selectionIds.map(id => getValueById(state, id)) as Struct[];
      for (const item of selected) {
        state = applicationReducer(state, removed(item.$$id, item.$$type));
      }
      return clearWorkspaceSelection(state, workspace.$$id);
    }

    case STAGE_TOOL_WINDOW_TITLE_CLICKED: {
      return handleWindowSelectionFromAction(state, (event as WindowPaneRowClicked).windowId, event as WindowPaneRowClicked);
    }

    case STAGE_TOOL_WINDOW_KEY_DOWN: {
      const e = event as StageWillWindowKeyDown;
      return moveItemFromAction(state, e.windowId, e);
    }

    case STAGE_TOOL_WINDOW_BACKGROUND_CLICKED: {
      const workspace = getSelectedWorkspace(state);
      return clearWorkspaceSelection(state, workspace.$$id);
    }
  }

  return state;
}

const moveItemFromAction = <T extends { sourceEvent: React.KeyboardEvent<any> }>(state: ApplicationState, itemId: string, event: T) => {
  const { sourceEvent } = event;
  const item = getValueById(state, itemId);

  // TODO - prop may not exist here -- need to use getBox instead
  const box = item.box;
  switch(sourceEvent.key) {
    case "ArrowDown": {
      return applicationReducer(state, moved(item.$$id, item.$$type, moveBox(box, { ...box, top: box.top + 1 })));
    }
    case "ArrowUp": {
      return applicationReducer(state, moved(item.$$id, item.$$type, moveBox(box, { ...box, top: box.top - 1 })));
    }
    case "ArrowLeft": {
      return applicationReducer(state, moved(item.$$id, item.$$type, moveBox(box, { ...box, left: box.left - 1 })));
    }
    case "ArrowRight": {
      return applicationReducer(state, moved(item.$$id, item.$$type, moveBox(box, { ...box, left: box.left + 1 })));
    }
  }

  return state;
};

const handleWindowSelectionFromAction = <T extends { sourceEvent: React.MouseEvent<any>, windowId }>(state: ApplicationState, itemId: string, event: T) => {
  const { windowId, sourceEvent } = event;
  const workspace = getSyntheticWindowWorkspace(state, windowId);
  return sourceEvent.metaKey || sourceEvent.ctrlKey ? addWorkspaceSelection(state, workspace.$$id, itemId) : toggleWorkspaceSelection(state, workspace.$$id, itemId);
}

const windowPaneReducer = (state: ApplicationState, event: BaseEvent) => {
  switch (event.type) {
    case WINDOW_PANE_ROW_CLICKED: {
      return handleWindowSelectionFromAction(state, (event as WindowPaneRowClicked).windowId, event as WindowPaneRowClicked);
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

const getStageToolMouseNodeTargetUID = (state: ApplicationState, event: StageToolOverlayMouseMoved|StageToolOverlayClicked) => {
  const { sourceEvent, windowId } = event as StageToolOverlayMouseMoved;
  const window = getSyntheticWindow(state, windowId);
  const workspace = getSyntheticWindowWorkspace(state, windowId);
  const zoom = workspace.visualEditorSettings.translate.zoom;

  // TODO - move to reducer
  const target = sourceEvent.nativeEvent.target as Element;
  const rect = target.getBoundingClientRect();
  const mouseX = sourceEvent.pageX - rect.left;
  const mouseY = sourceEvent.pageY - rect.top;

  const computedBoxs = window.computedBoxes;
  const intersectingBoxes: Box[] = [];
  const intersectingBoxMap = new Map<Box, string>();
  for (const uid in computedBoxs) {
    const box = computedBoxs[uid];
    if (pointIntersectsBox({ left: mouseX, top: mouseY }, zoomBox(box, zoom))) {
      intersectingBoxes.push(box);
      intersectingBoxMap.set(box, uid);
    }
  }
  const smallestBox = getSmallestBox(...intersectingBoxes);
  const uid = intersectingBoxMap.get(smallestBox);
  return uid;
}