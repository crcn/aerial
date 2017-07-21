import { noop, flowRight } from "lodash";
import { combineReducers } from "redux";
const reduceReducers = require("reduce-reducers");
import { initHTTPServer, HTTPServerState, httpServerReducer } from "./http";
import { initFrontEndService, FrontEndState } from "./front-end";
import { initBaseApplication, ConsoleLogState, Dispatcher } from "aerial-common2";


export type BackEndState = FrontEndState & HTTPServerState  & ConsoleLogState;

export const initApplication = <T>(initialState?: T) => (
  initBaseApplication(initialState, reduceReducers(httpServerReducer), (upstream: Dispatcher<any>) => flowRight(
    initHTTPServer(upstream),
    initFrontEndService(upstream)
  ))
);
