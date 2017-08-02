import { fork, put, call } from "redux-saga/effects";
import { difference } from "lodash";

import { 
  AddDependencyRequest, 
  AddDependencyResponse, 
  createAddDependencyRequest, 
  createEvaluateDependencyRequest,
  sandboxEnvironmentSaga
} from "aerial-sandbox2";

import { 
  OPEN_SYNTHETIC_WINDOW,
  OpenSyntheticBrowserWindowRequest,
  NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
  createNewSyntheticWindowEntryResolvedEvent
} from "../actions";

import {
  SyntheticEnvWindow
} from "../environment";

import { 
  watch,
  request,
  takeRequest, 
} from "aerial-common2";

import {
  SyntheticWindow,
  SyntheticBrowser,
  getSyntheticWindow,
  getSyntheticBrowser,
  SyntheticBrowserStore,
  getSyntheticBrowserStore, 
} from "../state";

export function* syntheticBrowserSaga() {
  yield fork(handleOpenSyntheticBrowserRequest);
  yield fork(handleStoreChanges);
}

function* handleOpenSyntheticBrowserRequest() {
  while(true) {
    yield takeRequest(OPEN_SYNTHETIC_WINDOW, function*({ uri }: OpenSyntheticBrowserWindowRequest) {
      yield put(createNewSyntheticWindowEntryResolvedEvent(uri));
    });
  }
}

function* handleStoreChanges() {
  let runningSyntheticBrowserIds = [];
  yield watch((root) => getSyntheticBrowserStore(root), function*(store: SyntheticBrowserStore) {
    const syntheticBrowserIds = store.browsers.map(item => item.$$id);
    yield* difference(syntheticBrowserIds, runningSyntheticBrowserIds).map((id) => (
      call(handleSyntheticBrowserSession, id)
    ));
    runningSyntheticBrowserIds = syntheticBrowserIds;
    return true;
  });
}

function* handleSyntheticBrowserSession(syntheticBrowserId: string) {
  let runningSyntheticWindowIds = [];
  yield watch((root) => getSyntheticBrowser(root, syntheticBrowserId), function*(syntheticBrowser: SyntheticBrowser) {

    // stop the session if there is no synthetic window
    if (!syntheticBrowser) return false;
    const syntheticWindowIds = syntheticBrowser.windows.map(item => item.$$id);
    yield* difference(syntheticWindowIds, runningSyntheticWindowIds).map((id) => (
      call(handleSytheticWindowSession, id)
    ));
    runningSyntheticWindowIds = syntheticWindowIds;
    return true;
  });
}

function* handleSytheticWindowSession(syntheticWindowId: string) {

  let env: SyntheticEnvWindow;

  yield watch((root) => getSyntheticWindow(root, syntheticWindowId), function*(syntheticWindow) {
    if (!syntheticWindow) return false;
    yield handleSyntheticWindowChange(syntheticWindow);
    return true;
  });

  function* handleSyntheticWindowChange(syntheticWindow: SyntheticWindow) {
    
  }
}