import { delay } from "redux-saga";
import { createQueue } from "mesh";
import * as express from "express";
const cors = require("cors");
import { RootState } from "../state"
import { logInfoAction , request } from "aerial-common2";
import { APPLICATION_STARTED, httpRequest } from "../actions";
import { put, take, call, fork, select } from "redux-saga/effects";

export function* httpSaga() {
  yield take(APPLICATION_STARTED);
  yield fork(startHTTPServer);
}

function* startHTTPServer() {
  const { http: { port }}: RootState = yield select();
  yield put(logInfoAction(`starting HTTP server on port ${port}`));
  const server = express();
  server.listen(port);
  server.use(cors());

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
    res.send((yield yield request(httpRequest(req))).payload);
  }
}