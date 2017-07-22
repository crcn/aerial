import { parallel } from "mesh";
import { Dispatcher, routeTypes, BaseEvent, WrappedEvent } from "aerial-common2";
import { 
  TREE_NODE_LABEL_CLICKED, 
  TreeNodeLabelClickedEvent,
  FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED,
  FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED,
} from "../components";

export const initMainDispatcher = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => parallel(
  routeTypes({
    [TREE_NODE_LABEL_CLICKED]: (event: TreeNodeLabelClickedEvent) => {
      // console.log("CLICKED");
    },
    [FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED]: (event: WrappedEvent) => {
      const name = prompt("File name");
    },
    [FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED]: (event: WrappedEvent) => {
      const name = prompt("File name");
    }
  }),
  downstream
)