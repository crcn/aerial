import { expect } from "chai";
import { fork, call, put, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import { default as createSagaMiddleware } from "redux-saga";
import { waitUntil, request } from "aerial-common2";
import { createCommonJSLoaderSaga } from "aerial-commonjs-extension2";

import { 
  createCachedFile,
  createDependency,
  createDependencyGraph,
  createURIProtocolSaga,
  isDependencyTreeLoaded,
  dependencyGraphReducer, 
  createDependencyGraphSaga, 
  createAddDependencyRequest,
  createLoadDependencyRequest,
} from "../index";

import { createTestProtocolAdapter } from "./utils";

describe(__filename + "#", () => {

  const TEST_FILES = {
    "/entry.js": {
      type: "application/javascript",
      content: `
        require('./a.js');
        require('./b.js');
      `
    },
    "/a.js": {
      type: "application/javascript",
      content: `
        require('./c.js');
        require('./d.js');
      `
    },
    "/b.js": {
      type: "application/javascript",
      content: `
        require('./a.js');
        require('./c.js');
      `
    },
    "/c.js": {
      type: "application/javascript",
      content: `
        require('./a.js');
        require('./b.js');
      `
    },
    "/d.js": {
      type: "application/javascript",
      content: `
        require('./b.js');
        require('./c.js');
      `
    }
  }

  const createTestStore = (run) => {
    const sagas = createSagaMiddleware();
    const store = createStore(
      dependencyGraphReducer,
      createDependencyGraph(),
      applyMiddleware(sagas)
    )
    sagas.run(function*() {
      yield fork(createCommonJSLoaderSaga());
      yield fork(createDependencyGraphSaga());
      yield fork(createURIProtocolSaga(createTestProtocolAdapter("local", TEST_FILES)));
      yield call(run);
    });
    return store;
  }
  
  it("can add a dependency to the dependency graph", (next) => {
    const { getState, dispatch } = createTestStore(function*() {
      const { payload: { hash }} = yield yield request(createAddDependencyRequest("local:///entry.js"));
      yield waitUntil((root) => isDependencyTreeLoaded(root, hash));
      next();
    });
  });
});