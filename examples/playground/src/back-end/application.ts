import { noop, flowRight } from "lodash";
import { combineReducers } from "redux";
const reduceReducers = require("reduce-reducers");
import { initMainService, mainServiceReducer, MainServiceState } from "./services";
import { initBaseApplication, ConsoleLogState, BaseApplicationState } from "aerial-common2";

export type BackEndState = BaseApplicationState & MainServiceState;

export const initApplication = <T>(initialState?: T) => initBaseApplication(initialState, mainServiceReducer, initMainService)

