import { BaseEvent, mapImmutable, getPathById, updateIn, getValueByPath, updateStruct } from "aerial-common2";
import { 
  ApplicationState,
  getSelectedWorkspace,
  createApplicationState,
  getSelectedWorkspaceFile,
} from "../state";
import { 
  TEXT_EDITOR_CHANGED,
  TextEditorChangedEvent,
  TREE_NODE_LABEL_CLICKED, 
  FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED,
  FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED,
  TreeNodeLabelClickedEvent, 
} from "../components";
import reduceReducers = require("reduce-reducers");

export const applicationReducer = (state = createApplicationState(), event: BaseEvent) => {
  switch(event.type) {
    case TREE_NODE_LABEL_CLICKED: {
      const { node } = event as TreeNodeLabelClickedEvent;
      return updateStruct(state, getSelectedWorkspace(state), "selectedFileId", node.$$id);
    }

    case TEXT_EDITOR_CHANGED: {
      const { file, value } = event as TextEditorChangedEvent;
      const path = getPathById(state, file.$$id);
      return updateStruct(state, getSelectedWorkspaceFile(getSelectedWorkspace(state)), "content", value);
    }

    case FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED: {
      const changedEvent = event as TextEditorChangedEvent;
      console.log(event.type)
    }

    case FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED: {
      const changedEvent = event as TextEditorChangedEvent;
      console.log(changedEvent.value);
    }
  }
  return state;
};
