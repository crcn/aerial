import { flowRight } from "lodash";
import { Dispatcher, HODispatcher } from "aerial-common2";

import { initBackEndService } from "./back-end";
import { initReactService, ReactServiceState } from "./react";

export type MainServiceState = ReactServiceState;

export const mainServiceReducer = (state, event) => {
  return state;
};

export const initMainService = (upstream: Dispatcher<any>) => flowRight<HODispatcher<any>>(
  initBackEndService(upstream),
  initReactService(upstream)
);

export * from "./react";
export * from "./back-end";
export * from "./workspace";