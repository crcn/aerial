import { expect } from "chai";
import { fork, call, put, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { default as createSagaMiddleware } from "redux-saga";
import { waitUntil, request } from "aerial-common2";
// import { createCommonJSLoaderSaga } from "aerial-commonjs-extension2";

import { 
  createWriteUriRequest,
  getFileCacheItemByUri,
  createReadUriRequest,
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
    "/a": {
      type: "text/plain",
      content: `a content`
    },
    "/b": {
      type: "text/plain",
      content: `b content`
    },
    "/c": {
      type: "text/plain",
      content: `c content`
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
      const uri = "local:///a";
      const { payload: { content, type }} = yield yield request(createReadUriRequest(uri));
      expect(content).to.eql("a content");
      expect(type).to.eql("text/plain");
      yield call(delay, 10);
      const item = getFileCacheItemByUri(yield select(), uri);
      expect(item.content).to.eql("a content");
      expect(item.contentType).to.eql("text/plain");
      next();
    });
  });

  it("uses the file cache if the URI exists", (next) => {
    const { getState, dispatch } = createTestStore(TEST_FILES_1, function*() {
      const uri = "local:///a";
      const { payload: { content, type }} = yield yield request(createReadUriRequest(uri));
      expect(content).to.eql("a content");
      expect(type).to.eql("text/plain");
      yield call(delay, 2);

      const { payload: { content2, type2, cached }} = yield yield request(createReadUriRequest(uri));

      expect(content).to.eql("a content");
      expect(type).to.eql("text/plain");
      expect(cached).to.eql(true);
      next();
    });
  });

  it("updates the cached file if the source URI changes", (next) => {
    const { getState, dispatch } = createTestStore(TEST_FILES_1, function*() {
      const uri = "local:///a";
      const { payload: { content, type }} = yield yield request(createReadUriRequest(uri));
      expect(content).to.eql("a content");
      expect(type).to.eql("text/plain");
      yield call(delay, 1);

      yield yield request(createWriteUriRequest(uri, "a2 content"));

      const { payload: { content: content2, type: type2, cached } } = yield yield request(createReadUriRequest(uri));

      expect(content2).to.eql("a2 content");
      expect(type2).to.eql("text/plain");
      expect(cached).to.eql(true);
      next();
    });
  });
});
