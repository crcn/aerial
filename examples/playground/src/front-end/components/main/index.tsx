import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { WorkspaceComponent } from "./workspace";
import { connect } from "react-redux";
import { ImmutableObject, Dispatcher } from "aerial-common2";
import { Workspace, ApplicationState, getSelectedWorkspace } from "front-end/state";
import { getSyntheticBrowser } from "aerial-browser-sandbox";

export type MainComponentOuterProps = {
  dispatch: Dispatcher<any>
};

export type MainComponentInnerProps = {
  dispatch: Dispatcher<any>;
  state: ApplicationState;
};

export const MainComponentBase = ({ state, dispatch }: MainComponentInnerProps) => {
  const workspace = getSelectedWorkspace(state);
  const browser   = getSyntheticBrowser(state, workspace.browserId);
  return <div className="main-component">
    { workspace && <WorkspaceComponent state={state} workspace={workspace} dispatch={dispatch} browser={browser} /> }
  </div>;
}

const enhanceMainComponent = compose<MainComponentInnerProps, MainComponentOuterProps>(
  connect((state: ApplicationState) => ({ state }))
);

export const MainComponent = enhanceMainComponent(MainComponentBase);

export * from "./workspace";
