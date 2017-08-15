export * from "./grid";

import "./index.scss";
import React =  require("react");
import { pure } from "recompose";
import { Workspace } from "front-end/state";
import { Dispatcher } from "aerial-common2";
import { EditTextToolComponent } from "./edit-text";
import { GridStageToolComponent } from "./grid";
import { WindowsStageToolComponent } from "./windows";
import { NodeOverlaysToolComponent } from "./overlay";
import { SelectionStageToolComponent } from "./selection";

export type ToolsComponentProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

export const ToolsLayerComponent = pure((({ workspace, dispatch }: ToolsComponentProps) => <div className="m-stage-tools">
  <GridStageToolComponent settings={workspace.visualEditorSettings} />
  <SelectionStageToolComponent workspace={workspace} dispatch={dispatch} />
  <NodeOverlaysToolComponent workspace={workspace} dispatch={dispatch} />
  <WindowsStageToolComponent workspace={workspace} dispatch={dispatch} />
  <EditTextToolComponent workspace={workspace} dispatch={dispatch} />
</div>) as any);

export * from "./selection";