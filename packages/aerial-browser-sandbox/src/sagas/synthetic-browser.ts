import { fork, put, call, spawn } from "redux-saga/effects";
import { difference } from "lodash";
import { createQueue } from "mesh";

import { 
  createReadUriRequest,
  AddDependencyRequest, 
  AddDependencyResponse, 
  createAddDependencyRequest, 
  createEvaluateDependencyRequest,
  sandboxEnvironmentSaga
} from "aerial-sandbox2";

import { 
  OPEN_SYNTHETIC_WINDOW,
  FetchRequest,
  FETCH_REQUEST,
  createFetchRequest,
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
  SEnvWindowInterface
} from "../environment";

export function* syntheticBrowserSaga() {
  yield fork(handleBrowserChanges);
  yield fork(handleFetchRequests);
}

function* handleFetchRequests() {
  while(true) {
    yield takeRequest(FETCH_REQUEST, function*({ info }: FetchRequest) {
      return (yield yield request(createReadUriRequest(String(info)))).payload;
    });
  }
}

function* handleBrowserChanges() {
  let runningSyntheticBrowserIds = [];
  yield watch((root) => getSyntheticBrowsers(root), function*(browsers: SyntheticBrowser[]) {
    const syntheticBrowserIds = browsers.map(item => item.$$id);
    yield* difference(syntheticBrowserIds, runningSyntheticBrowserIds).map((id) => (
      spawn(handleSyntheticBrowserSession, id)
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
      spawn(handleSytheticWindowSession, id)
    ));

    runningSyntheticWindowIds = syntheticWindowIds;
    return true;
  });
}

function* handleSytheticWindowSession(syntheticWindowId: string) {
  let cwindow: SyntheticWindow;
  let cenv: SEnvWindowInterface;

  yield watch((root) => getSyntheticWindow(root, syntheticWindowId), function*(syntheticWindow) {
    if (!syntheticWindow) {
      if (cenv) {
        cenv.close();
      }
      return false;
    }
    yield spawn(handleSyntheticWindowChange, syntheticWindow);
    return true;
  });

  function* handleSyntheticWindowChange(syntheticWindow: SyntheticWindow) {
    if (cwindow && cwindow.location === syntheticWindow.location) {
      return;
    }

    const fetchQueue = createQueue();

    yield fork(function*() {
      while(true) {
        const { value: [info, resolve] } = yield call(fetchQueue.next);
        resolve((yield yield request(createFetchRequest(info))).payload);
      }
    })

    cwindow = syntheticWindow;

    if (cenv) {
      cenv.close();
    }

    cenv = openSyntheticEnvironmentWindow(syntheticWindow.location, {
      fetch(info: RequestInfo) {
        return new Promise((resolve) => {
          fetchQueue.unshift([info, ({ content, type }) => {
            resolve({
              text() {
                return Promise.resolve(String(content));
              }
            } as any);
          }]);
        });
      },
      createRenderer: typeof window !== "undefined" ? createSyntheticDOMRendererFactory(document) : null
    });

    yield put(createSyntheticWindowSourceChangedEvent(syntheticWindow.$$id, cenv));
  }
}