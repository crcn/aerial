import "./index.scss";
import * as React from "react";
import { Workspace } from "../../../state";
import { FileNavigatorComponent } from "./file-navigator";
import { TextEditorComponent, VisualEditorComponent } from "./editors";

export type WorkspaceComponentProps = {
  worksapce: Workspace
}

export const WorkspaceComponentBase = ({ worksapce }: WorkspaceComponentProps) => {
  return <div className="workspace-component">
    <FileNavigatorComponent directory={worksapce.sourceFilesDirectory} />
    <TextEditorComponent />
    <VisualEditorComponent />
  </div>
}

export const WorkspaceComponent = WorkspaceComponentBase;