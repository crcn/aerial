import * as React from "react";
import { Dispatcher } from "aerial-common2";
import { GutterComponent } from "front-end/components/gutter";
import { WindowsPaneComponent } from "./windows";
import { ApplicationState, Workspace } from "front-end/state";

export type ProjectGutterComponentProps = {
  workspace: Workspace,
  dispatch: Dispatcher<any>
}

export const ProjectGutterComponentBase = ({ workspace, dispatch }: ProjectGutterComponentProps) => <GutterComponent>
 
  <WindowsPaneComponent workspace={workspace} dispatch={dispatch} />
</GutterComponent>;

export const ProjectGutterComponent = ProjectGutterComponentBase;

export * from "./file-navigator";
export * from "./windows";