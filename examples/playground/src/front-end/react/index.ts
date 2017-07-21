import * as React from "react";
import * as ReactDOM from "react-dom";
import { flowRight, identity } from "lodash";
import { readAll, parallel } from "mesh";
import { withContext, compose } from "recompose";
import { Component } from "../components";
import { 
  Dispatcher, 
  StoreChangedEvent, 
  reader, 
  whenType, 
  STORE_CHANGED, 
  whenStoreChanged,
  weakMemo,
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

const getEnhancedRootComponent = weakMemo((state: ReactServiceState) => enhanceRootComponent(state.mainComponentClass as any));

export const initReactService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => parallel(whenStoreChanged(identity, ({ payload: state }: StoreChangedEvent<ReactServiceState>) => {
  ReactDOM.render(React.createElement(getEnhancedRootComponent(state), { dispatch: upstream } as any), state.element);
}), downstream);