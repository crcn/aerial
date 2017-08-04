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
  SYNTHETIC_WINDOW_SOURCE_CHANGED,
  createSyntheticWindowSourceChangedEvent,
  OpenSyntheticBrowserWindowRequest,
  NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
  createNewSyntheticWindowEntryResolvedEvent
} from "../actions";

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
  getSyntheticBrowsers,
} from "../state";

import {
  openSyntheticEnvironmentWindow,
  SyntheticDOMRenderer,
  createSyntheticDOMRendererFactory,
  SEnvWindowAddon
} from "../environment";

export function* syntheticBrowserSaga() {
  yield fork(handleOpenSyntheticBrowserRequest);
  yield fork(handleBrowserChanges);
}

function* handleOpenSyntheticBrowserRequest() {
  while(true) {
    yield takeRequest(OPEN_SYNTHETIC_WINDOW, function*({ uri, syntheticBrowserId }: OpenSyntheticBrowserWindowRequest) {
      yield put(createNewSyntheticWindowEntryResolvedEvent(uri, syntheticBrowserId));
    });
  }
}

function* handleBrowserChanges() {
  let runningSyntheticBrowserIds = [];
  yield watch((root) => getSyntheticBrowsers(root), function*(browsers: SyntheticBrowser[]) {
    const syntheticBrowserIds = browsers.map(item => item.$$id);
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

  yield watch((root) => getSyntheticWindow(root, syntheticWindowId), function*(syntheticWindow) {
    if (!syntheticWindow) return false;
    yield handleSyntheticWindowChange(syntheticWindow);
    return true;
  });

  let cwindow: SyntheticWindow;
  let cenv: SEnvWindowAddon;

  function* handleSyntheticWindowChange(syntheticWindow: SyntheticWindow) {
    if (cwindow && cwindow.location === syntheticWindow.location) {
      return;
    }

    cwindow = syntheticWindow;

    if (cenv) {
      cenv.close();
    }

    cenv = openSyntheticEnvironmentWindow(syntheticWindow.location, {
      fetch(info: RequestInfo) {
        return Promise.resolve({
          text() {
            return Promise.resolve("HELLO WORLD");
          }
        } as any);
      },
      createRenderer: createSyntheticDOMRendererFactory(document)
    });

    yield put(createSyntheticWindowSourceChangedEvent(syntheticWindow.$$id, cenv));
  }
}