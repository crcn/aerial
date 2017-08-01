import { createQueue } from "mesh";
import { fork, take, call, put } from "redux-saga/effects";
import { URIProtocolReadResult } from "../state";
import { takeRequest, Request, Action, createRequestResponse } from "aerial-common2";
import { 
  READ_URI, 
  WRITE_URI, 
  DELETE_URI,
  WATCH_URI, 
  UNWATCH_URI,
  ReadUriRequest, 
  WriteUriRequest, 
  WatchUriRequest,
  DeleteUriRequest,
  UnwatchUriRequest,
  createUriWrittenEvent,
} from "../actions";

// TODOS:
// - support HTTP headers

export type URIProtocolAdapter = {
  name: string;
  read(uri: string): Promise<URIProtocolReadResult>;
  write(uri: string, content: Buffer, type?: string): Promise<any>;
  watch(uri: string, onChange: (result: URIProtocolReadResult) => any): () => any;
  delete(uri: string): Promise<any>;
}


const hasProtocol = (name: string, uri: string) => {
  return uri.split(":")[0] === name;
};

export function createURIProtocolSaga(adapter: URIProtocolAdapter) {
  return function*() {
    yield fork(handleReadRequest, adapter);
    yield fork(handleWriteRequest, adapter);
    yield fork(handleWatchRequest, adapter);
    yield fork(handleDeleteRequest, adapter);
  }
};

function* handleReadRequest(adapter: URIProtocolAdapter) {
  while(true) {
    yield takeRequest((request: ReadUriRequest) => request.type === READ_URI && hasProtocol(adapter.name, request.uri), function*({ uri }: ReadUriRequest) {
      return yield call(adapter.read, uri);
    });
  }
}

function* handleWriteRequest(adapter: URIProtocolAdapter) {
  while(true) {
    yield takeRequest((request: WriteUriRequest) => request.type === WRITE_URI && hasProtocol(adapter.name, request.uri), function*({ uri, contentType, content }: WriteUriRequest) {
      const result = yield call(adapter.write, uri, content, contentType);
      yield put(createUriWrittenEvent(uri, content, contentType));
      return result;
    });
  }
}

type FileWatcher = {
  uri: string,
  listener: (result: URIProtocolReadResult) => any,
  requestIds: string[]
};

type FileWatchers = {
  [identifier: string]: FileWatcher
};

function* handleWatchRequest(adapter: URIProtocolAdapter) {

  const watchers: FileWatchers = {};
  const watcherByRequestId = {};
  const changeQueue = createQueue<[string, URIProtocolReadResult]>();

  // watching
  yield fork(function*() {
    while(true) {
      const { $$id, uri } = (yield take((request: WatchUriRequest) => request.type === WATCH_URI && hasProtocol(adapter.name, request.uri))) as WatchUriRequest;
      if (!watchers[uri]) {
        const listener = (result: URIProtocolReadResult) => {

          changeQueue.unshift([uri, result]);
        };
        adapter.watch(uri, listener);
        watchers[uri] = {
          uri,
          listener,
          requestIds: []
        };
      }

      watchers[uri].requestIds.push($$id);
      watcherByRequestId[$$id] = watchers[uri];
    }
  });

  // changes
  yield fork(function*() {
    while(true) {
      const { value: [uri, result] } = yield call(changeQueue.next);
      const watcher = watchers[uri];
      if (!watcher) continue;
      for (const requestId of watcher.requestIds) {
        yield put(createRequestResponse(requestId, result));
      }
    }
  });

  // unwatching
  yield fork(function*() {
    while(true) {
      yield takeRequest((request: UnwatchUriRequest) => request.type === UNWATCH_URI, function({ watchRequestId }: UnwatchUriRequest) {
        const watcher = watcherByRequestId[watchRequestId];
        if (!watcher) return;
        watcherByRequestId[watchRequestId] = undefined;
        const i = watcher.requestIds.indexOf(watchRequestId);
        if (i !== -1) {
          watcher.requestIds.splice(i, 1);
        }

        if (watcher.requestIds.length === 0) {
          watchers[watcher.uri] = undefined;
        }
      });
    }
  });
}

function* handleDeleteRequest(adapter: URIProtocolAdapter) {
  while(true) {
    yield takeRequest((request: DeleteUriRequest) => request.type === DELETE_URI && hasProtocol(adapter.name, request.uri), function*({ uri }: DeleteUriRequest) {
      return yield call(adapter.delete, uri);
    });
  }
}


