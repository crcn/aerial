import { delay } from "redux-saga";
import { createQueue } from "mesh";
import * as express from "express";
const cors = require("cors");
import { httpSaga } from "./http";
import { ApplicationState } from "../state"
import { logInfoAction } from "aerial-common2";
import { APPLICATION_STARTED, httpRequest } from "../actions";
import { routesSaga } from "./routes";
import { put, take, call, fork, select } from "redux-saga/effects";
import { configSaga } from "./config";

export function* mainSaga() {
  yield fork(httpSaga);
  yield fork(routesSaga);
  yield fork(configSaga);
}
