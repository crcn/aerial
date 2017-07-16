import * as React from "react";
import * as ReactDOM from "react-dom";
import { flowRight } from "lodash";
import { withContext, compose } from "recompose";

import { Component } from "../components";
import { DispatcherContext, Dispatcher, Message, reader } from "aerial-common2";

export type ReactServiceConfig = {
  mainComponentClass: Component<any>,
  element: HTMLElement
};

export type ReactServiceContext = DispatcherContext;

type RootComponentProps = {
  dispatch: Dispatcher<any>
};

const enhanceRootComponent =  compose(
  withContext({
    dispatch: React.PropTypes.func
  }, ({ dispatch }: RootComponentProps) => ({
    dispatch
  }))
);

export const initReactService = ({ mainComponentClass, element }: ReactServiceConfig) => reader((context: ReactServiceContext) => {

  const RootComponent = enhanceRootComponent(mainComponentClass as any);

  const dispatch = (message: Message) => {
    ReactDOM.render(React.createElement(RootComponent, { dispatch } as any), element);
    context.dispatch(message);
  };
  
  return context.set("dispatch", dispatch);
});