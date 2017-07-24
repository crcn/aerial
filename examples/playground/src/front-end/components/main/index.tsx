import "./index.scss";
import * as React from "react";
import { pure } from "recompose";
import { WorkspaceComponent } from "./workspace";
import { ImmutableObject, Dispatcher, getValueById } from "aerial-common2";
import { Workspace, ApplicationState, getSelectedWorkspace } from "front-end/state";

export type MainComponentProps = {
  dispatch: Dispatcher<any>
  state: ApplicationState
};

export const MainComponentBase = ({ state, dispatch }: MainComponentProps) => {
  const workspace = getSelectedWorkspace(state);
  return <div className="main-component">
    { workspace && <WorkspaceComponent workspace={workspace} dispatch={dispatch} /> }
  </div>;
}

export const MainComponent = pure(MainComponentBase as any) as typeof MainComponentBase;

export * from "./workspace";
