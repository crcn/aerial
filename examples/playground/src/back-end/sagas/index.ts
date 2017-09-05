import * as path from "path";
import { delay } from "redux-saga";
import * as request from "request";
import * as express from "express";
const cors = require("cors");
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
  expressServer.use(cors());
  expressServer.use(
    express.static(path.dirname(frontEnd.entryPath))
  );

  expressServer.use("/proxy/:uri", (req, res, next) => {
    const { uri } = req.params;
    request({
      method: req.method,
      uri: uri,
      gzip: true
    }, (err, response, body) => {

      if (err) {
        return next(err);
      }

      res.set({
        "content-type": response.headers["content-type"]
      });
      res.send(body);
    });
  });
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