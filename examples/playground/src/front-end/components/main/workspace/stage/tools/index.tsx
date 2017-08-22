export * from "./grid";

import "./index.scss";
import React =  require("react");
import { pure, compose } from "recompose";
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
  zoom: number;
};

export const ToolsLayerBase = (({ workspace, browser, dispatch, zoom }: ToolsProps) => <div className="m-stage-tools">
  <GridStageTool stage={workspace.stage} />
  <SelectionStageTool zoom={zoom} workspace={workspace} browser={browser} dispatch={dispatch} />
  <NodeOverlaysTool zoom={zoom} workspace={workspace} browser={browser} dispatch={dispatch} />
  <WindowsStageTool workspace={workspace} browser={browser} dispatch={dispatch} />
  <EditTextTool zoom={zoom} workspace={workspace}  browser={browser} dispatch={dispatch} />
</div>);

export const ToolsLayer = compose<ToolsProps, ToolsProps>(
  pure
)(ToolsLayerBase);
