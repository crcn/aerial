import { expect } from "chai";
import { fork, call, put, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { default as createSagaMiddleware } from "redux-saga";
import { waitUntil, request } from "aerial-common2";
import { createCommonJSLoaderSaga } from "aerial-commonjs-extension2";

import { 
  sandboxEnvironmentSaga,
  createAddDependencyRequest,
  createAddSandboxEnvironmentRequest,
  dependencyGraphReducer,
  sandboxReducer,
  fileCacheReducer,
  fileCacheSaga,
  createDependencyGraph,
  createDependencyGraphSaga,
  createURIProtocolSaga,
  createSandbox,
} from "../index";

import { createTestProtocolAdapter } from "./utils";

describe(__filename + "#", () => {

  const TEST_FILES_1 = {
    "/entry.js": {
      type: "application/javascript",
      content: `
        modue.exports = "hello";
      `
    }
  };
  
  const createTestStore = (filesStub, run) => {
    const sagas = createSagaMiddleware();
    const store = createStore(
      fileCacheReducer,
      applyMiddleware(sagas)
    )
    sagas.run(function*() {
      yield fork(fileCacheSaga);
      yield fork(createURIProtocolSaga(createTestProtocolAdapter("local", filesStub)));
      yield call(run);
    });
    return store;
  }
  
  it("loads the URI data into the file cache", (next) => {
    const { getState, dispatch } = createTestStore(TEST_FILES_1, function*() {
      next();
    });
  });

  it("uses the file cache if the URI exists", (next) => {
    const { getState, dispatch } = createTestStore(TEST_FILES_1, function*() {
      next();
    });
  });

  xit("updates the cached file if the source URI changes");

});