import * as React from "react";
import { Dispatcher } from "aerial-common2";
import { GutterComponent } from "front-end/components/gutter";
import { WindowsPaneComponent } from "./windows";
import { ApplicationState, Workspace, SyntheticBrowser } from "front-end/state";

export type ProjectGutterComponentProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export const ProjectGutterComponentBase = ({ workspace, browser, dispatch }: ProjectGutterComponentProps) => <GutterComponent>
 
  <WindowsPaneComponent workspace={workspace} browser={browser} dispatch={dispatch} />
</GutterComponent>;

export const ProjectGutterComponent = ProjectGutterComponentBase;

// export * from "./file-navigator";
export * from "./windows";