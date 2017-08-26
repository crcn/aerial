import { delay } from "redux-saga";
import * as Url from "url";
import { whenLocation } from "../utils";
import { ApplicationState } from "../state";
import { fork, call, select, put } from "redux-saga/effects";
import { previewStarted, indexStarted } from "../actions";

export function* routesSaga() { 
  yield whenLocation(/^\/$/, handleIndex);
  yield whenLocation(/^\/files\/.*$/, handleFilePreview);
}

function* handleIndex() {
  console.log("INDEX");
  yield put(indexStarted());
}

function* handleFilePreview() {
  const { router: { location }}: ApplicationState = yield select();
  const relativePath = location.substr(`/files/`.length);
  console.log(relativePath, "RPATH");
  yield put(previewStarted());
}