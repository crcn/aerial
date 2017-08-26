import "./index.scss";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatcher } from "aerial-common2";
import { pure, compose } from "recompose";
import { ApplicationState, MainPageType } from "front-end/state";
import Master from "./master";
import Preview from "./preview";

export type MainOuterProps = {
  dispatch: Dispatcher<any>
};

export type MainInnerProps = {
  dispatch: Dispatcher<any>;
  state: ApplicationState;
};

export const MainBase = ({ state, dispatch }: MainInnerProps) => {

  const renderPage = {
    [MainPageType.INDEX]: () => <Master />,
    [MainPageType.PREVIEW]: () => <Preview />
  }[state.mainPage] || (() => <div>nada</div>);

  return <div>
    { renderPage() }
  </div>;
}

const enhanceMain = compose<MainInnerProps, MainOuterProps>(
  connect((state: ApplicationState) => ({ state }))
);

export const Main = enhanceMain(MainBase);
