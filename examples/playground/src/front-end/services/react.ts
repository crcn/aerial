import * as React from "react";
import { Component } from "front-end/components";
import * as ReactDOM from "react-dom";
import { readAll, parallel } from "mesh";
import { flowRight, identity } from "lodash";
import { withContext, compose } from "recompose";
import { 
  reader, 
  whenType, 
  weakMemo,
  whenMaster,
  Dispatcher, 
  STORE_CHANGED, 
  whenStoreChanged,
  StoreChangedEvent, 
} from "aerial-common2";

export type ReactServiceState = {
  mainComponentClass: Component<any>,
  element: HTMLElement
};

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

const getEnhancedRootComponent = weakMemo((componentClass: Component<any>) => enhanceRootComponent(componentClass as any));

export const initReactService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => whenMaster(parallel(whenStoreChanged(identity, ({ payload: state }: StoreChangedEvent<ReactServiceState>) => {
  ReactDOM.render(React.createElement(getEnhancedRootComponent(state.mainComponentClass), { dispatch: upstream, state } as any), state.element);
}), downstream));