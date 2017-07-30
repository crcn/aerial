import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { WorkspaceComponent } from "./workspace";
import { connect } from "react-redux";
import { ImmutableObject, Dispatcher, getValueById } from "aerial-common2";
import { Workspace, ApplicationState, getSelectedWorkspace } from "front-end/state";

export type MainComponentOuterProps = {
  dispatch: Dispatcher<any>
};

export type MainComponentInnerProps = {
  dispatch: Dispatcher<any>;
  state: ApplicationState;
};

export const MainComponentBase = ({ state, dispatch }: MainComponentInnerProps) => {
  const workspace = getSelectedWorkspace(state);
  return <div className="main-component">
    { workspace && <WorkspaceComponent workspace={workspace} dispatch={dispatch} /> }
  </div>;
}

const enhanceMainComponent = compose<MainComponentInnerProps, MainComponentOuterProps>(
  connect((state: ApplicationState) => ({ state }))
);

export const MainComponent = enhanceMainComponent(MainComponentBase);

export * from "./workspace";
