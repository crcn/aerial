import "./index.scss";
import * as React from "react";
import { pure } from "recompose";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { Dispatcher, Message } from "aerial-common2";
import { VisualGutterComponent } from "./element-gutter";
import { ProjectGutterComponent } from "./project-gutter";
import { StageComponent } from "./stage";
import { TextEditorComponent } from "./text-editor";
import { Workspace, getSelectedWorkspaceFile, ApplicationState } from "front-end/state";

export type WorkspaceComponentProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  state: ApplicationState;
  dispatch?:  Dispatcher<any>
};

export const WorkspaceComponentBase = ({ state, workspace, browser, dispatch }: WorkspaceComponentProps) => {
  const visualSettings = workspace.stage;
  return <div className="workspace-component">
    { visualSettings.showLeftGutter ? <ProjectGutterComponent workspace={workspace} browser={browser} dispatch={dispatch} /> : null }
    <div className="workspace-editors">
      <TextEditorComponent file={getSelectedWorkspaceFile(state, workspace)} cursorPosition={workspace.textCursorPosition} dispatch={dispatch} />
      <StageComponent workspace={workspace} dispatch={dispatch} browser={browser} />
    </div>
    { visualSettings.showRightGutter ? <VisualGutterComponent /> : null }
  </div>
}

export const WorkspaceComponent = pure(WorkspaceComponentBase as any) as typeof WorkspaceComponentBase;

export * from "./element-gutter";
export * from "./project-gutter";