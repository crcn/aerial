import { Mutation, editString, StringMutation, request } from "aerial-common2";
import { SEnvNodeInterface } from "../environment";
import { fork, take, select, put } from "redux-saga/effects";
import { APPLY_FILE_MUTATIONS, ApplyFileMutationsRequest, createMutateSourceContentRequest } from "../actions";
import { getFileCacheItemByUri, createUriCacheBustedEvent } from "aerial-sandbox2";

export function* fileEditorSaga() {
  yield fork(function* handleFileEditRequest() {
    while(true) {
      const { mutations } = (yield take(action => action.type === APPLY_FILE_MUTATIONS)) as ApplyFileMutationsRequest;
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
          stringMutations.push(
            (yield yield request(createMutateSourceContentRequest(fileCacheItem.content.toString(), fileCacheItem.contentType, mutation))).payload
          );
        }

        const newContent = editString(String(fileCacheItem.content), stringMutations);
        yield put(createUriCacheBustedEvent(uri, newContent, fileCacheItem.contentType));
      }
    }
  }); 
}