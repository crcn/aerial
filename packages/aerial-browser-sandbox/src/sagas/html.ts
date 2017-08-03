import * as path from "path";
import * as sm from "source-map";
import * as parse5 from "parse5";
import { fork } from "redux-saga/effects";
import { takeRequest } from "aerial-common2";
import { EVALUATE_SANDBOX_ENVIRONMENT, EvaluateDependencyRequest, DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT, DefaultGraphStrategyLoadContentRequest, hasURIProtocol } from "aerial-sandbox2";

export function createHTMLSandboxSaga(mimeType = "text/html") {
  return function*() {
    // yield fork(handleLoadHTMLContent);
    yield fork(handleEvaluateHTMLContent, mimeType);
  };
}

function* handleLoadHTMLContent(mimeType: string) {
  while(true) {
    yield takeRequest((req: DefaultGraphStrategyLoadContentRequest) => (
      req.type === DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT && req.contentType === mimeType
    ), function*({ dependency: { uri, hash }, content, contentType }: DefaultGraphStrategyLoadContentRequest) {
      
    });
  }
}

function* handleEvaluateHTMLContent(mimeType: string) {
  while(true) {
    yield takeRequest((req: EvaluateDependencyRequest) => req.type === EVALUATE_SANDBOX_ENVIRONMENT && req.entry.contentType === mimeType, ({ entry, type }: EvaluateDependencyRequest) => {
      
    });
  }
}
