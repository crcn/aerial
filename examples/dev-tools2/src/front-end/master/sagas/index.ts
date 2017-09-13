import { createSocketIOSaga, FILE_ADDED, FILE_REMOVED, getFilePathHash } from "../../../common";
import { diffArray, eachArrayValueMutation } from "aerial-common2";
import { fork, take, select } from "redux-saga/effects";
import { ApplicationState } from "../state";
import * as io from "socket.io-client";

const WINDOW_WIDTH  = 1366;
const WINDOW_HEIGHT = 768;
const WINDOW_PADDING = 10;

export function* mainSaga() {
  yield fork(startSocketIO);
  yield fork(syncWindows);
}

function* startSocketIO() {
  yield fork(createSocketIOSaga(io(`${location.protocol}//${location.host}`)));
}

function* handleEntryChanges() {
  while(true) {
    yield take([FILE_ADDED, FILE_REMOVED]);
  }
}

function* handleFileRemoved() {
  while(true) {
    yield take(FILE_REMOVED);
  }
}

function* syncWindows() {
  const state: ApplicationState = yield select();
  let currentHashes: string[] = state.entryHashes;
  const windows = currentHashes.map(openEntryHash);
  layoutWindows(windows);

  while(true) {
    yield take([FILE_ADDED, FILE_REMOVED]);

    // Note that we're syncing from the application state since
    // entryHashes are the source of truth here. 
    const state: ApplicationState = yield select();
    const diff = diffArray(currentHashes, state.entryHashes, (a, b) => a === b ? 0 : -1);
    eachArrayValueMutation(diff, {
      insert({ value, index }) {
        windows.splice(index, 0, openEntryHash(value));
      },
      delete({ index }) {
        const window = windows[index];
        windows.splice(index, 1);
        window.close();
      },
      update() {

      }
    });

    currentHashes = state.entryHashes;
  }
}

const layoutWindows = (windows: Window[]) => {
  let previousWindowLeft = WINDOW_WIDTH + WINDOW_PADDING;
  
    for (const window of windows) {
      window.moveTo(previousWindowLeft, 0);
      previousWindowLeft += WINDOW_WIDTH + WINDOW_PADDING;
    } 
}

const openEntryFilePath = (filePath: string) => openEntryHash(getFilePathHash(filePath));
const openEntryHash = (hash: string) => {
  const window = open(getHashIndexUrl(hash));
  window.resizeTo(WINDOW_WIDTH, WINDOW_HEIGHT);
  return window;
}
const getHashIndexUrl = (hash: string) => `${location.protocol}//${location.host}/${hash}.html`;
