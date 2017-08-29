import { delay } from "redux-saga";
import * as Url from "url";
import { FILE_CHANGED, FileEvent } from "common";
import { ApplicationState } from "../state";
import { whenLocation, apiFetch } from "../utils";
import { fork, call, select, put, take } from "redux-saga/effects";
import { previewStarted, indexStarted, watchingFiles } from "../actions";
// import "systemjs";

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

  yield fork(function* handleFileChanged() {
    while(true) {
      const event: FileEvent = yield take((action: FileEvent) => action.type === FILE_CHANGED && action.path === relativePath);
      console.log("FILE CHANGED");
    }
  });
  
  yield fork(function* handleSystemjs() {
    SystemJS.import(relativePath).then((m) => {
      console.log(m);
    });
  });
}