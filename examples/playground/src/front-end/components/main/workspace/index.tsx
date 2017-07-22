import "./index.scss";
import * as React from "react";
import { Workspace } from "../../../state";
import { Dispatcher, Message } from "aerial-common2";
import { FileNavigatorComponent } from "./file-navigator";
import { TextEditorComponent, VisualEditorComponent } from "./editors";

export type WorkspaceComponentProps = {
  workspace: Workspace,
  dispatch?:  Dispatcher<any>
};

export const WorkspaceComponentBase = ({ workspace, dispatch }: WorkspaceComponentProps) => {
  return <div className="workspace-component">
    <FileNavigatorComponent directory={workspace.sourceFilesDirectory} dispatch={dispatch} />
    <TextEditorComponent value={workspace.selectedFile && workspace.selectedFile.content} dispatch={dispatch} />
    <VisualEditorComponent />
  </div>
}

export const WorkspaceComponent = WorkspaceComponentBase;

export * from "./file-navigator";
export * from "./editors";