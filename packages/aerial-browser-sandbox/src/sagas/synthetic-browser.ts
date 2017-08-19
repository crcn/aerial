import { fork, take, put, call, spawn, actionChannel, select } from "redux-saga/effects";
import { eventChannel, delay } from "redux-saga";
import { difference, debounce } from "lodash";
import { createQueue } from "mesh";

import { 
  FileCacheItem,
  getFileCacheStore,
  FileCacheRootState,
  createReadUriRequest,
  AddDependencyRequest, 
  AddDependencyResponse, 
  getFileCacheItemByUri,
  sandboxEnvironmentSaga,
  createAddDependencyRequest, 
  createReadCacheableUriRequest,
  createEvaluateDependencyRequest,
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
  NODE_VALUE_STOPPED_EDITING,
  SyntheticNodeValueStoppedEditing,
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
  REMOVED,
  Removed,
  STOPPED_MOVING,
  request,
  shiftBox,
  moveBox,
  Mutation,
  diffArray,
  takeRequest, 
  Moved,
  MOVED,
  eachArrayValueMutation,
} from "aerial-common2";

import {
  createSyntheticComment,
  createSyntheticDocument,
  createSyntheticElement,
  createSyntheticTextNode,
  SyntheticNode,
  SyntheticParentNode,
  SyntheticElement,
  SyntheticTextNode,
  SyntheticBrowserRootState,
  isSyntheticNodeType,
  SyntheticComment,
  SyntheticDocument,
  BasicValueNode,
  SyntheticWindow,
  SyntheticBrowser,
  getSyntheticWindow,
  getSyntheticBrowser,
  getSyntheticBrowsers,
} from "../state";

import {
  diffWindow,
  diffDocument,
  patchWindow,
  SEnvNodeTypes,
  SEnvNodeInterface,
  SEnvTextInterface,
  getSEnvEventClasses,
  SEnvWindowInterface,
  SEnvElementInterface,
  SEnvCommentInterface,
  SyntheticDOMRenderer,
  SEnvDocumentInterface,
  waitForDocumentComplete,
  SyntheticWindowRendererEvent,
  createUpdateValueNodeMutation,
  openSyntheticEnvironmentWindow,
  createSetElementAttributeMutation,
  createSyntheticDOMRendererFactory,
  calculateUntransformedBoundingRect,
  createSetElementTextContentMutation,
  createParentNodeRemoveChildMutation,
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
  yield watch((root: SyntheticBrowserRootState) => getSyntheticBrowsers(root), function*(browsers: SyntheticBrowser[]) {
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
  yield watch((root: SyntheticBrowserRootState) => getSyntheticBrowser(root, syntheticBrowserId), function*(syntheticBrowser: SyntheticBrowser) {

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
    yield watch((root: SyntheticBrowserRootState) => getSyntheticWindow(root, syntheticWindowId), function*(syntheticWindow) {
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
    yield watch((root: FileCacheRootState) => root.fileCacheStore, function*(fileCache) {
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

  async function getCurrentSyntheticWindowDiffs(syntheticWindow: SyntheticWindow = cwindow) {
    const nenv = openTargetSyntheticWindow(syntheticWindow);
    await waitForDocumentComplete(nenv);
    return diffWindow(cenv, nenv);
  }

  let _reloading: boolean;
  let _shouldReloadAgain: boolean;

  function* reload(syntheticWindow: SyntheticWindow = cwindow) {

    if (_reloading) {
      _shouldReloadAgain = true;
      return;
    }

    if (cenv) {
      try {
        _reloading = true;
        const diffs = yield call(getCurrentSyntheticWindowDiffs, syntheticWindow);
        patchWindow(cenv, diffs);

      } catch(e) {
        console.warn(e);
      }
      _reloading = false;
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

      cenv.addEventListener(SEnvMutationEvent.MUTATION, (event) => {
        if (cenv.document.readyState !== "complete") return;
        console.log("STRUCT CHANGE", event.mutation.$$type);
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

  // TODO: deprecated. changes must be explicit in the editor instead of doing diff / patch work
  // since we may end up editing the wrong node otherwise (CC).
  yield fork(function*() {
    while(true) {
      const { nodeId } = (yield take(action => action.type === NODE_VALUE_STOPPED_EDITING && (action as SyntheticNodeValueStoppedEditing).syntheticWindowId === syntheticWindowId)) as SyntheticNodeValueStoppedEditing;
      const node = cenv.childObjects.get(nodeId) as HTMLElement;
      const mutation = createSetElementTextContentMutation(node, node.textContent);
      yield yield request(createApplyFileMutationsRequest(mutation));
    }
  });

  yield fork(function* handleRemoveNode() {
    while(true) {
      const {itemType, itemId}: Removed = (yield take((action: Removed) => action.type === REMOVED && isSyntheticNodeType(action.itemType) && cenv.childObjects.get(action.itemId)));
      const target = cenv.childObjects.get(itemId) as Node;
      const parent = target.parentNode;
      const removeMutation = createParentNodeRemoveChildMutation(parent, target);

      // remove immediately so that it's reflected in the canvas
      parent.removeChild(target);
      yield yield request(createApplyFileMutationsRequest(removeMutation));
    }
  });

  yield fork(function* handleMoveNode() {
    while(true) {
      const {itemType, itemId, point}: Moved = (yield take((action: Moved) => action.type === MOVED && isSyntheticNodeType(action.itemType) && cenv.childObjects.get(action.itemId)));
      const target = cenv.childObjects.get(itemId) as HTMLElement;
      
      // console.log(calculateUntransformedBoundingRect(target));
      // console.log("ITEM", itemType, target.getBoundingClientRect());
      const originalRect = target.getBoundingClientRect();
      // const box = moveBox(originalRect, point);


      // TODO - get best CSS style
      target.style.position = "fixed";
      target.style.left = String(point.left - cwindow.box.left) + "px";
      target.style.top  = String(point.top - cwindow.box.top) + "px";
    }
  });

  yield fork(function* handleMoveNodeStopped() {
    while(true) {
      const {itemType, itemId}: Moved = (yield take((action: Moved) => action.type === STOPPED_MOVING && isSyntheticNodeType(action.itemType) && cenv.childObjects.get(action.itemId)));
      const target = cenv.childObjects.get(itemId) as HTMLElement;

      // TODO - prompt where to persist style
      const mutation = createSetElementAttributeMutation(target, "style", target.getAttribute("style"));
      yield yield request(createApplyFileMutationsRequest(mutation));
    }
  });
}

const mapSEnvAttribute = ({name, value}: Attr) => ({
  name,
  value
})