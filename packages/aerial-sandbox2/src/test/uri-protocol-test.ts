import { fork, put } from "redux-saga/effects";
import { expect } from "chai";
import { createStore, applyMiddleware } from "redux";
import { default as createSagaMiddleware } from "redux-saga";
import { request, takeResponse } from "aerial-common2";

import { 
  WriteUriRequest,
  uriProtocolReducer,
  createReadUriRequest,
  createWriteUriRequest,
  createDeleteUriRequest,
  createWatchUriRequest,
  createUnwatchUriRequest,
  createURIProtocolSaga,
  createURIProtocolState,
} from "../index";

import { timeout, createTestProtocolAdapter } from "./utils"


describe(__filename + "#", () => {

  const createTestFiles = (prefix: string) => ({
    "a": {
      type: "text/plain",
      content: new Buffer(`${prefix} a content`)
    },
    "b": {
      type: "text/plain",
      content: new Buffer(`${prefix} b content`)
    },
    "c": {
      type: "text/plain",
      content: new Buffer(`${prefix} c content`)
    }
  });

  const createTestStore = (testSaga = (() => {})) => {
    const sagas = createSagaMiddleware();
    const store = createStore(
      uriProtocolReducer,
      createURIProtocolState(),
      applyMiddleware(sagas)
    );

    const localProtocolSaga  = createURIProtocolSaga(createTestProtocolAdapter("local", createTestFiles("local")));
    const local2ProtocolSaga = createURIProtocolSaga(createTestProtocolAdapter("local2", createTestFiles("local2")));

    sagas.run(function*() {
      yield fork(localProtocolSaga);
      yield fork(local2ProtocolSaga);
      yield fork(testSaga);
    });
    
    return store;
  };

  it("can call READ_URI on local protocol", (next) => {
    const { getState, dispatch } = createTestStore(function*() {
      const { payload: { type, content } } = yield yield request(createReadUriRequest("local://a"));
      expect(type).to.eql("text/plain");
      expect(content.toString("utf8")).to.eql("local a content");
      next();
    });
  });

  it("can call READ_URI on local2 protocol", (next) => {
    const { getState, dispatch } = createTestStore(function*() {
      const { payload: { type, content } } = yield yield request(createReadUriRequest("local2://a"));
      expect(content.toString("utf8")).to.eql("local2 a content");
      next();
    });
  });

  it("can call WRITE_URI on local protocol", (next) => {
    const { getState, dispatch } = createTestStore(function*() {
      const response = yield yield request(createWriteUriRequest("local://a", "local3 a2 content"));
      const { payload: { type, content } } = yield yield request(createReadUriRequest("local://a"));
      expect(content.toString("utf8")).to.eql("local3 a2 content");
      next();
    });
  });

  it("can call WRITE_URI on local2 protocol", (next) => {
    const { getState, dispatch } = createTestStore(function*() {
      const response = yield yield request(createWriteUriRequest("local2://a", "local3 a1 content"));
      let { payload: { type, content } } = yield yield request(createReadUriRequest("local2://a"));
      expect(content.toString("utf8")).to.eql("local3 a1 content");
      const { payload: { content: content2 } } = yield yield request(createReadUriRequest("local://a"));
      expect(content2.toString("utf8")).to.eql("local a content");
      next();
    });
  });

  it("can call DELETE_URI on local protocol", (next) => {
    const { getState, dispatch } = createTestStore(function*() {
      const response = yield yield request(createDeleteUriRequest("local://a"));
      const { payload } = yield yield request(createReadUriRequest("local://a"));
      expect(payload).to.eql(undefined);
      let { payload: { type, content } } = yield yield request(createReadUriRequest("local2://a"));
      expect(content.toString("utf8")).to.eql("local2 a content");
      next();
    });
  });

  it("can call WATCH_URI on local protocol", (next) => {
    const { getState, dispatch } = createTestStore(function*() {
      const req = createWatchUriRequest("local://a");
      const results = [];
      const watcher = yield request(req);
      yield fork(function*() {
        while(true) {
          results.push((yield watcher).payload)
        }
      })
      yield yield request(createWriteUriRequest("local://a", "local a2 content"));
      expect(results.length).to.eql(1);
      expect(results[0].content).to.eql("local a2 content");
      next();
    });
  });
  
  it("can unwatch a watcher on local protocol", (next) => {
    const { getState, dispatch } = createTestStore(function*() {
      const req = createWatchUriRequest("local://a");
      const results = [];
      const mutex = yield request(req);
      yield fork(function*() {
        results.push((yield mutex).payload);
        yield put(createUnwatchUriRequest(req.$id));
      });

      yield yield request(createWriteUriRequest("local://a", "local a3 content"));
      yield yield request(createWriteUriRequest("local://a", "local a4 content"));
      expect(results.length).to.eql(1);
      expect(results[0].content).to.eql("local a3 content");
      next();
    });
  });
}); 
