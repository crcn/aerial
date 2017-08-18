export * from "./grid";

import "./index.scss";
import React =  require("react");
import { pure } from "recompose";
import { Workspace } from "front-end/state";
import { Dispatcher } from "aerial-common2";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { EditTextToolComponent } from "./edit-text";
import { GridStageToolComponent } from "./grid";
import { WindowsStageToolComponent } from "./windows";
import { NodeOverlaysToolComponent } from "./overlay";
import { SelectionStageToolComponent } from "./selection";

export type ToolsComponentProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export const ToolsLayerComponent = pure((({ workspace, browser, dispatch }: ToolsComponentProps) => <div className="m-stage-tools">
  <GridStageToolComponent settings={workspace.visualEditorSettings} />
  <SelectionStageToolComponent workspace={workspace} browser={browser} dispatch={dispatch} />
  <NodeOverlaysToolComponent workspace={workspace} browser={browser} dispatch={dispatch} />
  <WindowsStageToolComponent workspace={workspace} browser={browser} dispatch={dispatch} />
  <EditTextToolComponent workspace={workspace}  browser={browser} dispatch={dispatch} />
</div>) as any);

export * from "./selection";