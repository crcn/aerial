import { take, fork } from "redux-saga/effects";
import { DefaultGraphStrategyLoadContentRequest, DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT } from "aerial-sandbox2";
import detective = require("detective");
import { request, takeRequest } from "aerial-common2";

export function createCommonJSLoaderSaga(mimeTypes = "application/javascript") {
  return function*() {
    yield fork(function*() {
      while(true) {
        yield takeRequest((request: DefaultGraphStrategyLoadContentRequest) => request.type === DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT && request.contentType === mimeTypes, ({ content, contentType }: DefaultGraphStrategyLoadContentRequest) => {
          const dependencies = detective(String(content));
          return {
            content,
            contentType,
            importedDependencyUris: dependencies
          };
        });
      }
    });
  };
}