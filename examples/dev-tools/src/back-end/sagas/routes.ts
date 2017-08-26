import { fork, put } from "redux-saga/effects";
import { createRequestResponse } from "aerial-common2";
import { HTTP_REQUEST, HTTPRequest } from "../actions";
import { takeHTTPRequest, serveStatic } from "../utils";

export function* routesSaga() {
  yield fork(handleMainRoute);
  yield fork(handleFileRoute);
}

function* handleMainRoute() {
  while(true) {
    
    // TODO - use static file helper here
    yield takeHTTPRequest(/^\/$/, serveStatic(__dirname));
  }
}

function* handleFileRoute() {
  yield takeHTTPRequest(/^\/files\/.+/, serveStatic(__dirname));
}