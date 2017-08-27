import { eventChannel } from "redux-saga";
import { fork, select, put, take, spawn } from "redux-saga/effects";
import { ApplicationState } from "../state";
import * as chokidar from "chokidar";
import { logDebugAction } from "aerial-common2"
import { fileAdded, fileRemoved, fileChanged } from "../actions";

export function* configSaga() {
  yield fork(handleFileChanges);
}

function* handleFileChanges() {
  const state: ApplicationState = yield select();
  const chan = eventChannel((emit) => {
    
    const watcher = chokidar.watch(state.config.sourceFiles);
    watcher.on("change", (path) => {
      emit(logDebugAction(`changed: ${path}`));
      emit(fileChanged(path));
    });
    watcher.on("add", (path) => {
      emit(logDebugAction(`added: ${path}`));
      emit(fileAdded(path));
    });
    watcher.on("remove", (path) => {
      emit(logDebugAction(`removed: ${path}`));
      emit(fileRemoved(path));
    });

    return () => {

    };
  });

  while(true) {
    const action = yield take(chan);
    yield spawn(function*() {
      yield put(action);
    });
  }
}