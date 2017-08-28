import { delay } from "redux-saga";
import { createQueue } from "mesh";
import { Express } from "express";
import { httpSaga } from "./http";
import { ApplicationState } from "../state"
import { logInfoAction } from "aerial-common2";
import { APPLICATION_STARTED, httpRequest } from "../actions";
import { routesSaga } from "./routes";
import { put, take, call, fork, select } from "redux-saga/effects";
import { configSaga } from "./config";

export function mainSaga(expressServer: Express) {
  return function*() {
    yield fork(httpSaga(expressServer));
    yield fork(routesSaga);
    yield fork(configSaga);
  }
}
