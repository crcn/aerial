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

  const mainReducer = (state = { sandbox: createSandbox(), dependencyGraph: createDependencyGraph() }, event) => {
    state = dependencyGraphReducer(state, event);
    state = sandboxReducer(state, event);
    return state;
  }

  const createTestStore = (filesStub, run) => {
    const sagas = createSagaMiddleware();
    const store = createStore(
      mainReducer,
      applyMiddleware(sagas)
    )
    sagas.run(function*() {
      yield fork(sandboxEnvironmentSaga);
      yield fork(createCommonJSLoaderSaga());
      yield fork(createDependencyGraphSaga());
      yield fork(createURIProtocolSaga(createTestProtocolAdapter("local", filesStub)));
      yield call(run);
    });
    return store;
  }
  
  it("can add a new sandbox environment", (next) => {
    const { getState, dispatch } = createTestStore(TEST_FILES_1, function*() {
      yield yield request(createAddSandboxEnvironmentRequest("local:///entry.js"));
      yield waitUntil((state) => state.sandbox.environments.length);
      const state = yield select();
      expect(state.sandbox.environments.length).to.eql(1);
      next();
    });
  });

  it("evaluates the entry file in the sandboxed environment", (next) => {
    const { getState, dispatch } = createTestStore(TEST_FILES_1, function*() {
      yield yield request(createAddSandboxEnvironmentRequest("local:///entry.js"));
      yield waitUntil((state) => state.sandbox.environments.length && state.sandbox.environments[0].exports);
      const state = yield select();
      expect(state.sandbox.environments.length).to.eql(1);
      next();
    });
  });

  xit("re-executes the entry file if the file cache changes", () => {

  });
});