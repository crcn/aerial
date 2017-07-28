export * from "./grid";

import "./index.scss";
import React =  require("react");
import { Workspace } from "front-end/state";
import { GridStageToolComponent } from "./grid";
import { pure } from "recompose";

export type ToolsComponentProps = {
  workspace: Workspace;
}

export const ToolsLayerComponent = pure((({ workspace }: ToolsComponentProps) => <div className="m-stage-tools">
  <GridStageToolComponent settings={workspace.visualEditorSettings} />
</div>) as any);
