import { SEnvNodeInterface } from "../environment";
import { delay } from "redux-saga";
import { fork, spawn, take, select, put, call } from "redux-saga/effects";
import {
  getFileCacheItemByUri, 
  uriCacheBusted, 
  createReadCacheableUriRequest,
  createReadUriRequest,
  createWriteUriRequest
} from "aerial-sandbox2";
import { Mutation, editString, StringMutation, request, createRequestResponse } from "aerial-common2";
import { 
  ApplyFileMutations, 
  APPLY_FILE_MUTATIONS, 
  applyFileMutationsRequest,
  mutateSourceContentRequest,
  mutateSourceContentRequest2,
  DEFER_APPLY_FILE_MUTATIONS, 
} from "../actions";

const DEFER_APPLY_EDIT_TIMEOUT = 10;

export function* fileEditorSaga() {

  let _deferring: boolean;
  let _batchMutations: Mutation<any>[];

  yield fork(function* handleDeferFileEditRequest() {
    while(true) {
      const req: ApplyFileMutations = yield take(DEFER_APPLY_FILE_MUTATIONS);
      if (!_batchMutations) {
        _batchMutations = [];
      }
      _batchMutations.push(...req.mutations);
      if (_deferring) {
        continue;
      }
      yield spawn(function*() {
        yield call(delay, DEFER_APPLY_EDIT_TIMEOUT);
        _deferring = false;
        const mutations = [..._batchMutations];
        _batchMutations = [];
        yield put(applyFileMutationsRequest(...mutations));
      });
    }
  });
  
  yield fork(function* handleFileEditRequest() {
    while(true) {
      const req: ApplyFileMutations = yield take(APPLY_FILE_MUTATIONS);
      const { mutations } = req;
      const state = yield select();
      const mutationsByUri: {
        [identifier: string]: Mutation<any>[]
      } = {};

      for (const mutation of mutations) {
        const source = (mutation.target as SEnvNodeInterface).source;
        if (!mutationsByUri[source.uri]) {
          mutationsByUri[source.uri] = [];
        }

        mutationsByUri[source.uri].push(mutation);
      }

      const stringMutations: StringMutation[] = [];

      for (const uri in mutationsByUri) {
        const mutations = mutationsByUri[uri];

        var data = new FormData();
        data.append( "json", JSON.stringify(mutateSourceContentRequest2(mutations)));

        yield call(fetch, uri, {
          method: "POST",
          body: data
        });
        
        // for (const mutation of mutations) {
        //   const stringMutation = (yield yield request(mutateSourceContentRequest(content.toString(), type, mutation))).payload;

        //   stringMutations.push(
        //     ...(Array.isArray(stringMutation) ? stringMutation : [stringMutation])
        //   );
        // }

        // const newContent = editString(String(content), stringMutations);
        // // yield put(uriCacheBusted(uri, newContent, type));
        // yield yield request(createWriteUriRequest(uri, content, type));
      }

      // yield put(createRequestResponse(req.$id, true));
    }
  }); 
}