import { flowRight } from "lodash";
import { Dispatcher, HODispatcher } from "aerial-common2";

import { initBackEndService } from "./back-end";
import { initWorkspaceService } from "./workspace";
import { initLocalProtocolService } from "./local-protocol";
import { initReactService, ReactServiceState } from "./react";
import { initRemoteSyntheticBrowserService } from "aerial-synthetic-browser";

export type MainServiceState = ReactServiceState;

export const mainServiceReducer = (state, event) => {
  return state;
};

export const initMainService = (upstream: Dispatcher<any>) => flowRight<HODispatcher<any>>(
  initBackEndService(upstream),
  initReactService(upstream),
  initWorkspaceService(upstream),
  initLocalProtocolService(upstream),
  initRemoteSyntheticBrowserService(upstream),
);

export * from "./react";
export * from "./back-end";
export * from "./workspace";