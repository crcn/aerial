import * as chokidar from "chokidar";
import { ExtensionState } from "../state";
import { VISUAL_DEV_CONFIG_LOADED, FILE_CHANGED, fileChanged } from "../actions";
import { take, fork, select, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";

export function* fileWatcherSaga() {
  yield fork(handleWatchProjectFiles);
}

function* handleWatchProjectFiles() {
  let watcher: chokidar.FSWatcher;

  while(true) {
    yield take(VISUAL_DEV_CONFIG_LOADED);
    if (watcher) {
      watcher.close();
    }
    const { visualDevConfig }: ExtensionState = yield select();
    watcher = chokidar.watch(visualDevConfig.sourceFilePattern);

    const chan = eventChannel((emit) => {
      watcher.on("change", (filePath) => {
        console.log(`file changed: ${filePath}`);
        emit(fileChanged(filePath));
      });
      return () => {}
    });

    while(true) {
      yield put(yield take(chan));
    }

  }
}