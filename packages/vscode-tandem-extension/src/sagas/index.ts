import { apiSaga } from "./api";
import { vscodeSaga } from "./vscode";
import { projectSaga } from "./project";
import { expresssServerSaga } from "./express-server";
import { take, fork, spawn, call } from "redux-saga/effects";
import { fileWatcherSaga } from "./file-watcher";

export function* mainSaga() {
  yield fork(apiSaga);
  yield fork(vscodeSaga);
  yield fork(projectSaga);
  yield fork(expresssServerSaga);
  yield fork(fileWatcherSaga);
}