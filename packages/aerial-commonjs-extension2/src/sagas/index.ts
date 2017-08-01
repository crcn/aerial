import { take, fork } from "redux-saga/effects";
import { DefaultGraphStrategyLoadContentRequest, DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT, EVALUATE_DEPENDENCY, EvaluateDependencyRequest, DependencyGraph, Dependency } from "aerial-sandbox2";
import * as path from "path";
import detective = require("detective");
import { request, takeRequest, weakMemo } from "aerial-common2";
import { Script, createContext } from "vm";

export function createCommonJSSaga(mimeType = "application/javascript") {
  return function*() {
    yield fork(handleLoadCommonJS, mimeType);
    yield fork(handleEvaluateCommonJS, mimeType);
  };
}

function* handleLoadCommonJS(mimeType: string) {
  while(true) {
    yield takeRequest((request: DefaultGraphStrategyLoadContentRequest) => request.type === DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT && request.contentType === mimeType, ({ content, contentType }: DefaultGraphStrategyLoadContentRequest) => {
      const dependencies = detective(String(content));
      return {
        content,
        contentType,
        importedDependencyUris: dependencies
      };
    });
  }
}


function* handleEvaluateCommonJS(mimeType: string) {
  while(true) {
    yield takeRequest((request: EvaluateDependencyRequest) => request.type === EVALUATE_DEPENDENCY && request.entry.contentType === mimeType, ({ context: globalContext, entry, graph }: EvaluateDependencyRequest) => {

      const moduleContexts = globalContext.$$moduleContexts = {};
      globalContext.global = globalContext;
      globalContext.console = console;

      const evaluate = (dep: Dependency) => {
        if (moduleContexts[dep.hash]) return moduleContexts[dep.hash].module.exports;
        
        const script = compile(dep.hash, dep.uri, String(dep.content));

        const context = moduleContexts[dep.hash] = {
          __dirname: path.dirname(dep.uri),
          __filename: dep.uri,
          require(depPath) {
            const hash = dep.importedDependencyHashes[dep.importedDependencyUris.indexOf(depPath)];
            return evaluate(graph.allDependencies[hash]);
          },
          module: {
            exports: {}
          }
        };

        script.runInContext(globalContext);

        return context.module.exports;
      }


      return evaluate(entry);
    });
  }
}

const compile = weakMemo((hash: string, uri: string, content: string) => {
  return new Script(`
    with($$moduleContexts["${hash}"]) {
      ${content}
    }
  `, {
    filename: uri,
    displayErrors: true
  });
});