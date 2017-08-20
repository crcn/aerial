import * as React from "react";
import { Dispatcher } from "aerial-common2";
import { Gutter } from "front-end/components/gutter";
import { WindowsPane } from "./windows";
import { ApplicationState, Workspace, SyntheticBrowser } from "front-end/state";

export type ProjectGutterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export const ProjectGutterBase = ({ workspace, browser, dispatch }: ProjectGutterProps) => <Gutter>
 
  <WindowsPane workspace={workspace} browser={browser} dispatch={dispatch} />
</Gutter>;

export const ProjectGutter = ProjectGutterBase;

// export * from "./file-navigator";
export * from "./windows";