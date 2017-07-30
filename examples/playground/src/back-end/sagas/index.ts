import * as path from "path";
import { delay } from "redux-saga";
import * as express from "express";
import { logInfoAction } from "aerial-common2";
import { httpServerStarted, log } from "../actions";
import { HTTPServerState, FrontEndState } from "../state";
import { take, all, fork, spawn, put, select, call } from "redux-saga/effects";

function* getExpressServer() {
  let expressServer;
  while(!expressServer) {  
    expressServer = yield select((state: HTTPServerState) => state.http.expressServer);
    if (!expressServer) {
      yield call(delay, 10);
    };
  }

  return expressServer;
}

function* frontEndService() {
  const { frontEnd }: FrontEndState = yield select();
  const expressServer = yield call(getExpressServer);
  expressServer.use(
    express.static(path.dirname(frontEnd.entryPath))
  );
}

function* httpService() {
  const httpPort = yield select((state: HTTPServerState) => state.http.port);
  yield put(logInfoAction(`starting HTTP server on port ${httpPort}`));
  const server = express();
  server.listen(httpPort);
  yield put(httpServerStarted(server));
}

export function* mainSaga() {
  yield fork(httpService);
  yield fork(frontEndService);
};