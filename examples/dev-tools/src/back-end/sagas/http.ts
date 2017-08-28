import { delay } from "redux-saga";
import { createQueue } from "mesh";
import * as express from "express";
const cors = require("cors");
import { ApplicationState } from "../state"
import { logInfoAction, request } from "aerial-common2";
import { APPLICATION_STARTED, httpRequest } from "../actions";
import { put, take, call, fork, select, spawn } from "redux-saga/effects";

export function httpSaga(server: express.Express) {
  return function*() {
    const { http: { port }}: ApplicationState = yield select();
    server.use(cors());
    yield put(logInfoAction(`starting HTTP server on port ${port}`));

    yield take(APPLICATION_STARTED);
    const q = createQueue<[express.Request, express.Response]>();
    
    // TODOS:
    // / main file
    // / 
    // /file/:uriEncodedPath
    server.use((req, res) => {
      q.unshift([req, res]);
    });
  
    while(true) {
      const { value: [req, res] } = yield call(q.next);
      yield spawn(function*() {
        res.send((yield yield request(httpRequest(req))).payload);
      });
    }
  };
}