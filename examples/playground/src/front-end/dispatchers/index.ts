import { Kernel } from "aerial-common";
import { parallel } from "mesh";
import { SyntheticBrowser } from "aerial-synthetic-browser";
import { URIProtocolProvider, FileCacheProtocol } from "aerial-sandbox";
import { Workspace, ApplicationState } from "../state";

import { 
  BaseEvent, 
  Dispatcher, 
  routeTypes, 
  WrappedEvent,
  whenStoreChanged,
  StoreChangedEvent,
} from "aerial-common2";

import {
  TREE_NODE_LABEL_CLICKED, 
  TreeNodeLabelClickedEvent,
  FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED,
  FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED,
} from "../components";

console.log("OK");

export const initMainDispatcher = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => parallel(
  workspaceDispatcher(upstream),
  filesDispatcher(upstream),
  downstream
);

const filesDispatcher = (upstream: Dispatcher<any>) => routeTypes({
  [TREE_NODE_LABEL_CLICKED]: (event: TreeNodeLabelClickedEvent) => {

  },
  [FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED]: (event: WrappedEvent) => {
    const name = prompt("File name");
  },
  [FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED]: (event: WrappedEvent) => {
    const name = prompt("Folder name");
  }
});

const workspaceDispatcher = (upstream: Dispatcher<any>) => parallel(
  (message) => {
    console.log(message);
  },
  whenStoreChanged((state: ApplicationState) => state.selectedWorkspaceId, async ({ payload: state }: StoreChangedEvent<ApplicationState>) => {

    const kernel = new Kernel(
      // new FileCacheProvider()
    );
    const browser = new SyntheticBrowser(kernel);
    console.log("OKK");

    // await browser.open({
    //   uri: "file://index.html"
    // });
  })
);
