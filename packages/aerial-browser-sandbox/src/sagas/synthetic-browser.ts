import { fork, take, put, call, spawn, actionChannel } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
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
  FetchRequest,
  FETCH_REQUEST,
  createFetchRequest,
  OPEN_SYNTHETIC_WINDOW,
  createSyntheticWindowLoadedEvent,
  SYNTHETIC_WINDOW_SOURCE_CHANGED,
  createSyntheticWindowRectsUpdated,
  OpenSyntheticBrowserWindowRequest,
  NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
  createSyntheticWindowSourceChangedEvent,
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
  SEnvNodeTypes,
  SEnvNodeInterface,
  SEnvCommentInterface,
  SEnvTextInterface,
  SEnvElementInterface,
  SEnvWindowInterface,
  SyntheticDOMRenderer,
  SEnvDocumentInterface,
  SyntheticWindowRendererEvent,
  openSyntheticEnvironmentWindow,
  createSyntheticDOMRendererFactory,
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

    const fetchQueue = createQueue();

    yield fork(function*() {
      while(true) {
        const { value: [info, resolve] } = yield call(fetchQueue.next);
        resolve((yield yield request(createFetchRequest(info))).payload);
      }
    });

    if (cenv) {
      cenv.close();
    }

    cenv = openSyntheticEnvironmentWindow(syntheticWindow.location, {
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
      createRenderer: typeof window !== "undefined" ? createSyntheticDOMRendererFactory(document) : null
    });

    const chan = eventChannel((emit) => {

      cenv.renderer.addEventListener(SyntheticWindowRendererEvent.PAINTED, ({ rects }: SyntheticWindowRendererEvent) => {
        emit(createSyntheticWindowRectsUpdated(syntheticWindowId, rects));
      });

      cenv.document.addEventListener("readystatechange", () => {
        if (cenv.document.readyState !== "complete") return;
        const documentStruct = mapSEnvDocumentToStruct(cenv.document as SEnvDocumentInterface);
        emit(createSyntheticWindowLoadedEvent(syntheticWindowId, documentStruct));
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
}

const mapSEnvDocumentToStruct = (document: SEnvDocumentInterface): SyntheticDocument => {
  const titleEl = document.querySelector("title");
  return createSyntheticDocument({
    title: titleEl ? titleEl.textContent : null,
    documentElement: mapSEnvNodeToStruct(document.documentElement as any as SEnvNodeInterface)
  });
};

const mapSEnvNodeToStruct = (node: SEnvNodeInterface): SyntheticNode => {
  switch(node.nodeType) {
    case SEnvNodeTypes.ELEMENT: return createSyntheticElement({
      $$id: node.uid,
      source: node.source,
      nodeName: node.nodeName,
      attributes: Array.prototype.map.call((node as any as SEnvElementInterface).attributes, mapSEnvAttribute),
      childNodes: Array.prototype.map.call((node as any as SEnvElementInterface).childNodes, mapSEnvNodeToStruct)
    });

    case SEnvNodeTypes.TEXT: return createSyntheticTextNode({
      $$id: node.uid,
      source: node.source,
      nodeValue: (node as any as SEnvTextInterface).nodeValue,
    });

    case SEnvNodeTypes.COMMENT: return createSyntheticComment({
      $$id: node.uid,
      source: node.source,
      nodeValue: (node as any as SEnvCommentInterface).nodeValue,
    });
  }

  return null;
};

const mapSEnvAttribute = ({name, value}: Attr) => ({
  name,
  value
})