import { Event, mapImmutable } from "aerial-common2";
import { ApplicationState, createApplicationState } from "../state";
import { 
  TEXT_EDITOR_CHANGED,
  TextEditorChangedEvent,
  TREE_NODE_LABEL_CLICKED, 
  TreeNodeLabelClickedEvent, 
} from "../components";
import reduceReducers = require("reduce-reducers");

export const applicationReducer = (state = createApplicationState(), event: Event) => {
  switch(event.type) {
    case TREE_NODE_LABEL_CLICKED: {
      const treeNodeEvent = event as TreeNodeLabelClickedEvent;
      return {
        ...state,
        selectedWorkspace: {
          ...state.selectedWorkspace,
          selectedFile: treeNodeEvent.node
        }
      };
    }

    case TEXT_EDITOR_CHANGED: {
      const changedEvent = event as TextEditorChangedEvent;
      console.log(changedEvent.value);
    }
  }
  return state;
};
