import { delay } from "redux-saga";
import * as Url from "url";
import { ApplicationState } from "../state";
import { whenLocation, apiFetch } from "../utils";
import { fork, call, select, put } from "redux-saga/effects";
import { previewStarted, indexStarted, watchingFiles } from "../actions";

export function* routesSaga() { 
  yield whenLocation(/^\/$/, handleIndex);
  yield whenLocation(/^\/files\/.*$/, handleFilePreview);
}

function* handleIndex() {
  yield put(indexStarted());
  yield put(watchingFiles(yield apiFetch("/files")));
}

function* handleFilePreview() {
  const { router: { location }}: ApplicationState = yield select();
  const relativePath = location.substr(`/files/`.length);
  yield put(previewStarted());
}