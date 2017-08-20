export * from "./grid";

import "./index.scss";
import React =  require("react");
import { pure } from "recompose";
import { Workspace } from "front-end/state";
import { Dispatcher } from "aerial-common2";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { EditTextTool } from "./edit-text";
import { GridStageTool } from "./grid";
import { WindowsStageTool } from "./windows";
import { NodeOverlaysTool } from "./overlay";
import { SelectionStageTool } from "./selection";

export type ToolsProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export const ToolsLayer = pure((({ workspace, browser, dispatch }: ToolsProps) => <div className="m-stage-tools">
  <GridStageTool settings={workspace.stage} />
  <SelectionStageTool workspace={workspace} browser={browser} dispatch={dispatch} />
  <NodeOverlaysTool workspace={workspace} browser={browser} dispatch={dispatch} />
  <WindowsStageTool workspace={workspace} browser={browser} dispatch={dispatch} />
  <EditTextTool workspace={workspace}  browser={browser} dispatch={dispatch} />
</div>) as any);
