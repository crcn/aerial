const reduceReducers = require("reduce-reducers");

import { flowRight } from "lodash";
import { Dispatcher, HODispatcher } from "aerial-common2";
import { initFrontEndService, FrontEndState } from "./front-end";
import { initHTTPServer, httpServerReducer, HTTPServerState } from "./http";

export type MainServiceState    = HTTPServerState & FrontEndState;
export const mainServiceReducer = reduceReducers(
  httpServerReducer
);

export const initMainService = (upstream: Dispatcher<any>) => flowRight(
  initHTTPServer(upstream),
  initFrontEndService(upstream)
) as HODispatcher<any>;
