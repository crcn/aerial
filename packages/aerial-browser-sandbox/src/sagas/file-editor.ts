import { Mutation, editString, StringMutation, request, createRequestResponse } from "aerial-common2";
import { SEnvNodeInterface } from "../environment";
import { fork, take, select, put } from "redux-saga/effects";
import { APPLY_FILE_MUTATIONS, ApplyFileMutations, mutateSourceContentRequest } from "../actions";
import { getFileCacheItemByUri, uriCacheBusted } from "aerial-sandbox2";

export function* fileEditorSaga() {
  yield fork(function* handleFileEditRequest() {
    while(true) {
      const req = (yield take(action => action.type === APPLY_FILE_MUTATIONS)) as ApplyFileMutations;
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
        const fileCacheItem = getFileCacheItemByUri(state, uri);
        for (const mutation of mutations) {
          const stringMutation = (yield yield request(mutateSourceContentRequest(fileCacheItem.content.toString(), fileCacheItem.contentType, mutation))).payload;

          stringMutations.push(
            ...(Array.isArray(stringMutation) ? stringMutation : [stringMutation])
          );
        }

        const newContent = editString(String(fileCacheItem.content), stringMutations);
        yield put(uriCacheBusted(uri, newContent, fileCacheItem.contentType));
      }

      yield put(createRequestResponse(req.$$id, true));
    }
  }); 
}