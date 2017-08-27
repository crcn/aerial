import "./index.scss";
import * as React from "react";
import { pure } from "recompose";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { Dispatcher, Message } from "aerial-common2";
import { VisualGutter } from "./element-gutter";
import { ProjectGutter } from "./project-gutter";
import { Stage } from "./stage";
import { TextEditor } from "./text-editor";
import { Workspace as WorkspaceStruct, getSelectedWorkspaceFile, ApplicationState } from "front-end/state";

export type WorkspaceProps = {
  workspace: WorkspaceStruct;
  browser: SyntheticBrowser;
  state: ApplicationState;
  dispatch?:  Dispatcher<any>
};

export const WorkspaceBase = ({ state, workspace, browser, dispatch }: WorkspaceProps) => {
  const stage = workspace.stage;
  return <div className="workspace-component">
    { stage.showLeftGutter ? <ProjectGutter workspace={workspace} browser={browser} dispatch={dispatch} /> : null }
    <div className="workspace-editors">
      { stage.showTextEditor ? <TextEditor file={getSelectedWorkspaceFile(state, workspace)} cursorPosition={workspace.textEditor.cursorPosition} dispatch={dispatch} /> : null }
      <Stage workspace={workspace} dispatch={dispatch} browser={browser} />
    </div>
    { stage.showRightGutter ? <VisualGutter /> : null }
  </div>
};

export const Workspace = pure(WorkspaceBase as any) as typeof WorkspaceBase;
