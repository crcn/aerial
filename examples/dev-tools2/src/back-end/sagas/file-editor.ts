import { take, fork, takeEvery, select, put } from "redux-saga/effects";
import { editString, logWarningAction, StringMutation } from "aerial-common2";
import { ApplicationState, getFileCacheContent } from "../state";
import * as fs from "fs";
import { MutateSourceContentRequest, MUTATE_SOURCE_CONTENT, fileContentMutated } from "../actions";

export function* fileEditorSaga() {
  yield fork(handleMutateSourceContentRequest);
}

const MTIME_PADDING = 500;

function* handleMutateSourceContentRequest() {
  while(true) {
    const { filePath, mutations }: MutateSourceContentRequest = yield take(MUTATE_SOURCE_CONTENT);

    const state: ApplicationState = yield select();
    const { config: { editSourceContent } } = state;

    // TODO - fetch data from cache
    let content = getFileCacheContent(filePath, state) || fs.readFileSync(filePath, "utf8");
    let stringMutations: StringMutation[] = [];
    
    for (const mutation of mutations) {
      if (!editSourceContent) {
        yield put(logWarningAction(`Cannot apply "${mutation.$type}" since "editSourceContent" does not exist in config`));
        continue;
      }

      const result = editSourceContent(content, mutation, filePath);
      stringMutations.push(...(Array.isArray(result) ? result : [result]));
    }  

    content = editString(content, stringMutations);

    // padding is necessary to ensure that the cached content mtime is later than the FS trigger below, otherwise the cached content will be updated immediately.
    yield put(fileContentMutated(filePath, content, new Date(Date.now() + MTIME_PADDING)));

    // A bit ugly, but just touch the source file to trigger file watchers. 
    fs.writeFileSync(filePath, fs.readFileSync(filePath, "utf8"));
  }
}