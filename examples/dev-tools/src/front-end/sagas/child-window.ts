import { fork, take, select } from "redux-saga/effects";
import { ApplicationState, ChildWindow } from "../state";
import { WATCHING_FILES, WatchingFiles } from "../actions";
import { diffArray, eachArrayValueMutation } from "aerial-common2";
import * as so from "socket.io";


export function* childWindowSaga() {
  yield fork(syncWindowInstances);
}

function* syncWindowInstances() {

  let currentChildWindows: ChildWindow[] = [];
  let nativeWindows: Window[] = [];

  while(true) {
    yield take([WATCHING_FILES]);
    const state: ApplicationState = yield select();
    if (!state.indexPage) continue;
    const diffs = diffArray(
      currentChildWindows, 
      state.indexPage.childWindows, 
      (a, b) => a.location === b.location ? -1 : 1
    );
    eachArrayValueMutation(diffs, {
      insert({ value, index }) {
        nativeWindows.splice(index, 0, window.open(value.location));
        syncWindow(nativeWindows[index], value);
      },
      delete({ index }) {
        nativeWindows[index].close();
        nativeWindows.splice(index, 1);
      },
      update({ newValue, index, patchedOldIndex }) {
        if (index !== patchedOldIndex) {
          const v = nativeWindows[patchedOldIndex];
          nativeWindows.splice(patchedOldIndex, 1);
          nativeWindows.splice(index, 0, v);
        }
        syncWindow(nativeWindows[index], newValue);
      }
    });

    currentChildWindows = state.indexPage.childWindows;
  }
}

const syncWindow = (window: Window, struct: ChildWindow) => {
  window.resizeTo(
    struct.bounds.right - struct.bounds.left, 
    struct.bounds.bottom - struct.bounds.top
  );
} 
  
