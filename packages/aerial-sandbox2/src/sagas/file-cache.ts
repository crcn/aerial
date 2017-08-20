import { fork, put, select, spawn, take, call } from "redux-saga/effects";
import { takeRequest, request, createRequestResponse } from "aerial-common2";
import { READ_URI, CACHEABLE_READ_URI, ReadUriRequest, uriCacheBusted } from "../actions";
import { getFileCacheItemByUri, URIProtocolReadResult } from "../state";

export function* fileCacheSaga() {
  yield fork(handleReadFileRequest);
}

export type NoCacheable = {
  noCache: boolean;
}

// TODO:
// - support HTTP headers such as TTL

function* handleReadFileRequest() {
  yield fork(function*() {
    while(true) {
      const req = (yield take((req: ReadUriRequest & NoCacheable) => req.type === CACHEABLE_READ_URI && !req.noCache)) as ReadUriRequest;
      const fileCacheItem = getFileCacheItemByUri(yield select(), req.uri);
      if (fileCacheItem) {
        yield put(createRequestResponse(req.$$id, {
          cached: true,
          content: fileCacheItem.content,
          type: fileCacheItem.contentType
        }));
        continue;
      }

      yield fork(function*() {
        const { payload: result } = yield yield request({...req, type: READ_URI, noCache: true } as ReadUriRequest & NoCacheable);
        yield put(uriCacheBusted(req.uri, result.content, result.type));
        yield put(createRequestResponse(req.$$id, result));
      });
    }
  });
}