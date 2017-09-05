import { take, fork, takeEvery, select, put } from "redux-saga/effects";
import { editString, logWarningAction, StringMutation } from "aerial-common2";
import { ApplicationState } from "../state";
import * as fs from "fs";
import { MutateSourceContentRequest, MUTATE_SOURCE_CONTENT } from "../actions";

export function* fileEditorSaga() {
  yield fork(handleMutateSourceContentRequest);
}

function* handleMutateSourceContentRequest() {
  while(true) {
    const { filePath, mutations }: MutateSourceContentRequest = yield take(MUTATE_SOURCE_CONTENT);

    const { config: { editSourceContent } }: ApplicationState = yield select();

    // TODO - fetch data from cache
    let content = fs.readFileSync(filePath, "utf8");
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

    console.log(content);
  }
}