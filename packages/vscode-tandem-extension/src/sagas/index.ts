import { apiSaga } from "./api";
import { vscodeSaga } from "./vscode";
import { projectSaga } from "./project";
import { START_DEV_SERVER_EXECUTED, STOP_DEV_SERVER_EXECUTED } from "../actions";
import { expresssServerSaga } from "./express-server";
import { take, fork, spawn, call, cancel } from "redux-saga/effects";
import { fileWatcherSaga } from "./file-watcher";

export function* mainSaga() {
  yield fork(vscodeSaga);

  while(true) {
    // wait for command to be executed in vscode
    yield take(START_DEV_SERVER_EXECUTED);

    const proc = yield spawn(function*() {
      yield fork(apiSaga);
      yield fork(projectSaga);
      yield fork(expresssServerSaga);
      yield fork(fileWatcherSaga);
    });

    yield take(STOP_DEV_SERVER_EXECUTED);

    yield cancel(proc);
  }
}