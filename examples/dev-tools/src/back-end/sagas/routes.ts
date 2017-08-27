import { ApplicationState } from "../state";
import { fork, put, select } from "redux-saga/effects";
import { createRequestResponse } from "aerial-common2";
import { HTTP_REQUEST, HTTPRequest } from "../actions";
import { takeHTTPRequest, serveStatic } from "../utils";

export function* routesSaga() {
  // TODO - use static file helper here
  yield takeHTTPRequest(/^\/files$/, handleFilesRequest);
}

function* handleFilesRequest() {
  const state: ApplicationState = yield select();
  return state.watchingFilePaths;
}