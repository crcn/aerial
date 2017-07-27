import { BaseEvent, mapImmutable, getPathById, updateIn, getValueByPath, updateStructProperty, updateStruct } from "aerial-common2";

import { 
  ApplicationState,
  getSelectedWorkspace,
  createApplicationState,
  getSelectedWorkspaceFile,
} from "front-end/state";

import { 
  syntheticBrowserReducer,
  getSyntheticBrowserWindow,
  OPEN_SYNTHETIC_WINDOW_REQUESTED,
} from "aerial-synthetic-browser";

import { 
  TEXT_EDITOR_CHANGED,
  TextEditorChangedEvent,
  CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED,
  CanvasElementsComputedPropsChanged,
  TREE_NODE_LABEL_CLICKED, 
  FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED,
  FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED,
  TreeNodeLabelClickedEvent, 
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