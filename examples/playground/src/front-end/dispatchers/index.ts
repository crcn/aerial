import { parallel } from "mesh";
import { TREE_NODE_LABEL_CLICKED, TreeNodeLabelClickedEvent } from "../components";
import { Dispatcher, routeTypes, Event } from "aerial-common2";

export const initMainDispatcher = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => parallel(
  routeTypes({
    [TREE_NODE_LABEL_CLICKED]: (event: TreeNodeLabelClickedEvent) => {
      console.log("CLICKED");
    }
  }),
  downstream
)