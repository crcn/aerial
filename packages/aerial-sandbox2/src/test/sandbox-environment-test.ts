import { expect } from "chai";
import { fork, call, put, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { default as createSagaMiddleware } from "redux-saga";
import { waitUntil, request } from "aerial-common2";
import { createCommonJSSaga } from "aerial-commonjs-extension2";

import { 
  fileCacheSaga,
  createFileCacheStore,
  fileCacheReducer,
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
        module.exports = "hello";
      `
    }
  };

  const mainReducer = (state = { sandbox: createSandbox(), dependencyGraph: createDependencyGraph(), fileCacheStore: createFileCacheStore() }, event) => {
    state = dependencyGraphReducer(state, event);
    state = sandboxReducer(state, event);
    state = fileCacheReducer(state, event);
    return state;
  }

  const createTestStore = (filesStub, run) => {
    const sagas = createSagaMiddleware();
    const store = createStore(
      mainReducer,
      applyMiddleware(sagas)
    );
    sagas.run(function*() {
      yield fork(fileCacheSaga);
      yield fork(sandboxEnvironmentSaga);
      yield fork(createCommonJSSaga());
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
      const env = state.sandbox.environments[0];
      expect(env.exports).to.eql("hello");
      next();
    });
  });


  it("can evaluate an entry with a dependency", (next) => {
    const { getState, dispatch } = createTestStore({
      "/b.js": {
        type: "application/javascript",
        content: `
          module.exports = require("./c.js");
        `
      },
      "/c.js": {
        type: "application/javascript",
        content: `
          module.exports = "d";
        `
      }
    }, function*() {
      yield yield request(createAddSandboxEnvironmentRequest("local:///b.js"));
      yield waitUntil((state) => state.sandbox.environments.length && state.sandbox.environments[0].exports);
      const state = yield select();
      const env = state.sandbox.environments[0];
      expect(env.exports).to.eql("d");
      next();
    });
  });

  it("shares the same global context", (next) => {
    const { getState, dispatch } = createTestStore({
      "/b.js": {
        type: "application/javascript",
        content: `
          global.ping = "ping";
          require("./c.js");
          module.exports = global.pong;
        `
      },
      "/c.js": {
        type: "application/javascript",
        content: `
          global.pong = global.ping + " pong";
        `
      }
    }, function*() {
      yield yield request(createAddSandboxEnvironmentRequest("local:///b.js"));
      yield waitUntil((state) => state.sandbox.environments.length && state.sandbox.environments[0].exports);
      const state = yield select();
      const env = state.sandbox.environments[0];
      expect(env.exports).to.eql("ping pong");
      expect(global["pong"]).to.eql(undefined);
      next();
    });
  });

  it("re-executes the entry file if the file cache changes", () => {

  });
});