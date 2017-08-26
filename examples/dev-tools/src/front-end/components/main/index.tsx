import "./index.scss";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatcher } from "aerial-common2";
import { pure, compose } from "recompose";
import { ApplicationState } from "front-end/state";

export type MainOuterProps = {
  dispatch: Dispatcher<any>
};

export type MainInnerProps = {
  dispatch: Dispatcher<any>;
  state: ApplicationState;
};

export const MainBase = ({ state, dispatch }: MainInnerProps) => {
  return <div>
    MAIN!
  </div>;
}

const enhanceMain = compose<MainInnerProps, MainOuterProps>(
  connect((state: ApplicationState) => ({ state }))
);

export const Main = enhanceMain(MainBase);
