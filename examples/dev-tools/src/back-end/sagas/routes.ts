import { fork, put } from "redux-saga/effects";
import { createRequestResponse } from "aerial-common2";
import { takeHTTPRequest } from "../utils";
import { HTTP_REQUEST, HTTPRequest } from "../actions";

export function* routesSaga() {
  yield fork(handleMainRoute);
  yield fork(handleFileRoute);
}

function* handleMainRoute() {
  while(true) {
    
    // TODO - use static file helper here
    yield takeHTTPRequest(/^\/$/, action => {
      return "blah!";
    });
  }
}

function* handleFileRoute() {
  
}