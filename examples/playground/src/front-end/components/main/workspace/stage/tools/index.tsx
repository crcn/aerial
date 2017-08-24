export * from "./grid";

import "./index.scss";
import React =  require("react");
import { pure, compose } from "recompose";
import { Workspace } from "front-end/state";
import { Dispatcher, Translate } from "aerial-common2";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { EditTextTool } from "./edit-text";
import { GridStageTool } from "./grid";
import { WindowsStageTool } from "./windows";
import { NodeOverlaysTool } from "./overlay";
import { SelectionStageTool } from "./selection";

export type ToolsProps = {
  translate: Translate;
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export const ToolsLayerBase = (({ workspace, browser, dispatch, translate }: ToolsProps) => <div className="m-stage-tools">
  <GridStageTool translate={translate} />
  <NodeOverlaysTool zoom={translate.zoom} workspace={workspace} browser={browser} dispatch={dispatch} />
  <SelectionStageTool zoom={translate.zoom} workspace={workspace} browser={browser} dispatch={dispatch} />
  <WindowsStageTool workspace={workspace} browser={browser} dispatch={dispatch} translate={translate} />
  <EditTextTool zoom={translate.zoom} workspace={workspace}  browser={browser} dispatch={dispatch} />
</div>);

export const ToolsLayer = compose<ToolsProps, ToolsProps>(
  pure
)(ToolsLayerBase);
