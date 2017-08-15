import { fork, take, put, call, spawn, actionChannel, select } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { difference, debounce } from "lodash";
import { createQueue } from "mesh";

import { 
  getFileCache,
  FileCache,
  FileCacheItem,
  getFileCacheItemByUri,
  createReadUriRequest,
  createReadCacheableUriRequest,
  AddDependencyRequest, 
  AddDependencyResponse, 
  createAddDependencyRequest, 
  createEvaluateDependencyRequest,
  sandboxEnvironmentSaga
} from "aerial-sandbox2";

import {
  htmlContentEditorSaga
} from "./html-content-editor";

import {
  fileEditorSaga
} from "./file-editor";

import { 
  FetchRequest,
  FETCH_REQUEST,
  createFetchRequest,
  OPEN_SYNTHETIC_WINDOW,
  createApplyFileMutationsRequest,
  SYNTHETIC_WINDOW_PERSIST_CHANGES,
  SyntheticWindowPersistChangesRequest,
  SyntheticNodeTextContentChanged,
  SyntheticWindowSourceChangedEvent,
  createSyntheticWindowLoadedEvent,
  SYNTHETIC_WINDOW_SOURCE_CHANGED,
  createSyntheticWindowRectsUpdated,
  OpenSyntheticBrowserWindowRequest,
  SYNTHETIC_NODE_TEXT_CONTENT_CHANGED,
  NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
  createSyntheticWindowSourceChangedEvent,
  createSyntheticWindowResourceLoadedEvent,
  createNewSyntheticWindowEntryResolvedEvent
} from "../actions";

import { 
  watch,
  request,
  takeRequest, 
} from "aerial-common2";

import {
  createSyntheticComment,
  createSyntheticDocument,
  createSyntheticElement,
  createSyntheticTextNode,
  SyntheticNode,
  SyntheticHTMLElement,
  SyntheticTextNode,
  SyntheticComment,
  SyntheticDocument,
  SyntheticWindow,
  SyntheticBrowser,
  getSyntheticWindow,
  getSyntheticBrowser,
  getSyntheticBrowsers,
} from "../state";

import {
  diffWindow,
  patchWindow,
  SEnvNodeTypes,
  SEnvNodeInterface,
  SEnvCommentInterface,
  SEnvTextInterface,
  SEnvElementInterface,
  getSEnvEventClasses,
  SEnvWindowInterface,
  SyntheticDOMRenderer,
  SEnvDocumentInterface,
  waitForDocumentComplete,
  SyntheticWindowRendererEvent,
  openSyntheticEnvironmentWindow,
  createSyntheticDOMRendererFactory,
} from "../environment";

export function* syntheticBrowserSaga() {
  yield fork(handleBrowserChanges);
  yield fork(handleFetchRequests);
  yield fork(htmlContentEditorSaga);
  yield fork(fileEditorSaga);
}

function* handleFetchRequests() {
  while(true) {
    yield takeRequest(FETCH_REQUEST, function*({ info }: FetchRequest) {
      return (yield yield request(createReadCacheableUriRequest(String(info)))).payload;
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
  let cachedFiles: FileCacheItem[];
  const fetchQueue = createQueue();

  yield fork(function*() {
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
  });

  function* getFetchedCacheFiles() {
    const state = yield select();
    return cwindow.externalResourceUris.map(uri => getFileCacheItemByUri(state, uri));
  }

  function* updateFetchedCacheFiles() {
    cachedFiles = yield getFetchedCacheFiles();
  }

  yield fork(function*() {
    yield watch((root) => getFileCache(root), function*(fileCache) {
      const updatedCachedFiles = yield getFetchedCacheFiles();
      if (cachedFiles && cenv.document.readyState === "complete" && difference(cachedFiles, updatedCachedFiles).length !== 0) {
        yield spawn(reload);
      }
      yield updateFetchedCacheFiles();
      return true;
    });
  });

  yield fork(function*() {
    while(true) {
      const { value: [info, resolve] } = yield call(fetchQueue.next);
      const body = (yield yield request(createFetchRequest(info))).payload;
      yield put(createSyntheticWindowResourceLoadedEvent(syntheticWindowId, String(info)));
      resolve(body);
      yield updateFetchedCacheFiles();
    }
  });

  function* handleSyntheticWindowChange(syntheticWindow: SyntheticWindow) {
    yield fork(handleSizeChange, syntheticWindow),
    yield fork(handleLocationChange, syntheticWindow)
    cwindow = syntheticWindow;
  }

  function* handleSizeChange(syntheticWindow: SyntheticWindow) {
    if (!cwindow || cwindow.box === syntheticWindow.box) {
      return;
    }
    cenv.resizeTo(syntheticWindow.box.right - syntheticWindow.box.left, syntheticWindow.box.bottom - syntheticWindow.box.top)
  }

  function* handleLocationChange(syntheticWindow: SyntheticWindow) {
    if (cwindow && cwindow.location === syntheticWindow.location) {
      return;
    }
    yield reload(syntheticWindow);
  }

  function openTargetSyntheticWindow(syntheticWindow: SyntheticWindow) {
    return openSyntheticEnvironmentWindow(syntheticWindow.location, {
      console: {
        warn(...args) {
          console.warn('VM ', ...args);
        },
        log(...args) {
          console.log('VM ', ...args);
        },
        error(...args) {
          console.error('VM ', ...args);
        },
        info(...args) {
          console.info('VM ', ...args);
        }
      } as any,
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
      createRenderer: !cenv && typeof window !== "undefined" ? createSyntheticDOMRendererFactory(document) : null
    });
  }

  async function getCurrentSyntheticWindowDiffs(syntheticWindow: SyntheticWindow = cwindow, reverse?: boolean) {
    const nenv = openTargetSyntheticWindow(syntheticWindow);
    await waitForDocumentComplete(nenv);
    return diffWindow(reverse ? nenv : cenv, reverse ? cenv : nenv);
  }

  let _reloading: boolean;
  let _shouldReloadAgain: boolean;

  function* reload(syntheticWindow: SyntheticWindow = cwindow) {
    if (_reloading) {
      _shouldReloadAgain = true;
      return;
    }

    if (cenv) {
      _reloading = true;
      const diffs = yield call(getCurrentSyntheticWindowDiffs, syntheticWindow);
      _reloading = false;
      patchWindow(cenv, diffs);
      if (_shouldReloadAgain) {
        _shouldReloadAgain = false;
        yield reload(syntheticWindow);
      }
    } else {
      cenv = openTargetSyntheticWindow(syntheticWindow);
      yield fork(watchNewWindow, syntheticWindow);
    }
  }

  function* watchNewWindow(syntheticWindow: SyntheticWindow) {
    const { SEnvMutationEvent } = getSEnvEventClasses(cenv);
    const chan = eventChannel((emit) => {

      cenv.renderer.addEventListener(SyntheticWindowRendererEvent.PAINTED, ({ rects, styles }: SyntheticWindowRendererEvent) => {
        emit(createSyntheticWindowRectsUpdated(syntheticWindowId, rects, styles));
      });
      
      const emitStructChange = debounce(() => {
        emit(createSyntheticWindowLoadedEvent(syntheticWindowId, cenv.document.struct));
      }, 0);

      cenv.addEventListener(SEnvMutationEvent.MUTATION, () => {
        if (cenv.document.readyState !== "complete") return;
        // multiple mutations may be fired, so batch everything in one go
        emitStructChange();
      });

      cenv.document.addEventListener("readystatechange", () => {
        if (cenv.document.readyState !== "complete") return;
        emit(createSyntheticWindowLoadedEvent(syntheticWindowId, cenv.document.struct));
      });

      return () => {

      };
    });

    yield fork(function*() {
      while(true) {
        yield put(yield take(chan));
      }
    });

    yield put(createSyntheticWindowSourceChangedEvent(syntheticWindow.$$id, cenv));
  }

  yield fork(function*() {
    while(true) {
      const { syntheticNodeId, textContent } = (yield take((action) => action.type === SYNTHETIC_NODE_TEXT_CONTENT_CHANGED && (action as SyntheticNodeTextContentChanged).syntheticWindowId === syntheticWindowId)) as SyntheticNodeTextContentChanged;
      const syntheticNode = cenv.childObjects.get(syntheticNodeId);
      syntheticNode.textContent = textContent;
    }
  }); 

  yield fork(function*() {
    while(true) {
      (yield take(action => action.type === SYNTHETIC_WINDOW_PERSIST_CHANGES && (action as SyntheticWindowPersistChangesRequest).syntheticWindowId === syntheticWindowId));
      const diffs = yield call(getCurrentSyntheticWindowDiffs, cwindow, true);
      yield put(createApplyFileMutationsRequest(diffs));
    }
  });
}

const mapSEnvAttribute = ({name, value}: Attr) => ({
  name,
  value
})