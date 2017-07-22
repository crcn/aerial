import "./index.scss";
import * as React from "react";
import { Workspace, getSelectedWorkspaceFile } from "../../../state";
import { Dispatcher, Message, getValueById } from "aerial-common2";
import { FileNavigatorComponent } from "./file-navigator";
import { TextEditorComponent, VisualEditorComponent } from "./editors";
import { VisualGutterComponent } from "./visual-gutter";

export type WorkspaceComponentProps = {
  workspace: Workspace,
  dispatch?:  Dispatcher<any>
};

export const WorkspaceComponentBase = ({ workspace, dispatch }: WorkspaceComponentProps) => {
  return <div className="workspace-component">
    <FileNavigatorComponent directory={workspace.sourceFilesDirectory} dispatch={dispatch} />
    <TextEditorComponent file={getSelectedWorkspaceFile(workspace)} dispatch={dispatch} />
    <VisualEditorComponent />
    <VisualGutterComponent />
  </div>
}

export const WorkspaceComponent = WorkspaceComponentBase;

export * from "./file-navigator";
export * from "./editors";