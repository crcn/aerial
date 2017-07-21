import * as React from "react";
import * as ReactDOM from "react-dom";
import { flowRight } from "lodash";
import { readAll } from "mesh";
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

export const initReactService = ({ mainComponentClass, element }: ReactServiceConfig) => reader(<TContext extends ReactServiceContext>(context: TContext) => {

  const RootComponent = enhanceRootComponent(mainComponentClass as any);


  const downstream = (message: Message) => {
    console.log(message);
    ReactDOM.render(React.createElement(RootComponent, { dispatch: context.upstream } as any), element);
    context.downstream(message);
  };

  setTimeout(() => {
    readAll(context.upstream({ type: "TEST" }));
  })
  
  return context.set("downstream", downstream);
});