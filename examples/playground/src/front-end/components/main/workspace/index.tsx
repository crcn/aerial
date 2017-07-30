import "./index.scss";
import * as React from "react";
import { pure } from "recompose";
import { Workspace, getSelectedWorkspaceFile } from "front-end/state";
import { Dispatcher, Message, getValueById } from "aerial-common2";
import { ProjectGutterComponent } from "./project-gutter";
import { TextEditorComponent, VisualEditorComponent } from "./editors";
import { VisualGutterComponent } from "./element-gutter";

export type WorkspaceComponentProps = {
  workspace: Workspace,
  dispatch?:  Dispatcher<any>
};

export const WorkspaceComponentBase = ({ workspace, dispatch }: WorkspaceComponentProps) => {
  const visualSettings = workspace.visualEditorSettings;
  return <div className="workspace-component">
    { visualSettings.showLeftGutter ? <ProjectGutterComponent workspace={workspace} dispatch={dispatch} /> : null }
    <div className="workspace-editors">
      <TextEditorComponent file={getSelectedWorkspaceFile(workspace)} dispatch={dispatch} />
      <VisualEditorComponent workspace={workspace} dispatch={dispatch} />
    </div>
    { visualSettings.showRightGutter ? <VisualGutterComponent /> : null }
  </div>
}

export const WorkspaceComponent = pure(WorkspaceComponentBase as any) as typeof WorkspaceComponentBase;

export * from "./element-gutter";
export * from "./project-gutter";
export * from "./editors";