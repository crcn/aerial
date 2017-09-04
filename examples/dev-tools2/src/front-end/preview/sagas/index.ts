import { createSocketIOSaga, BUNDLE_INFO_CHANGED, BundleInfoChanged } from "../../../common";
import { fork, take, select, put } from "redux-saga/effects";
import * as io from "socket.io-client";
import { ApplicationState } from "../state"
import { entryBundleChanged, ENTRY_BUNDLE_CHANGED } from "../actions";

export function* mainSaga() {
  yield fork(startSocketIO);
  yield fork(handleBundleInfoChanged);
  yield fork(handleEntryBundleChanged);
}

function* startSocketIO() {
  yield fork(createSocketIOSaga(io(`${location.protocol}//${location.host}`)));
}

function* handleBundleInfoChanged() {
  while(true) {
    const { info }: BundleInfoChanged = yield take(BUNDLE_INFO_CHANGED);
    const { entryHash, entryInfo }: ApplicationState = yield select();
    if (entryInfo && info[entryHash] && info[entryHash].buildTimestamp !== entryInfo.buildTimestamp) {
      yield put(entryBundleChanged());
    }
  }
}

declare const URIChangedEvent: any;

function* handleEntryBundleChanged() {

  yield take(ENTRY_BUNDLE_CHANGED);
  const { entryHash }: ApplicationState = yield select();

  // in synthetic environment
  if (typeof URIChangedEvent !== "undefined") {
    const event = new URIChangedEvent(`${location.protocol}//${location.host}/${entryHash}.js`);
    window.dispatchEvent(event);
  }


  // just reload the window -- Aerial/Tandem will do all the hotswapping. 
  location.reload();
}