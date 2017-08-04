import { expect } from "chai";
import { dependencyGraphReducer, createDependencyGraph, createDependencyGraphSaga, sandboxEnvironmentSaga, sandboxReducer, uriProtocolReducer, createURIProtocolSaga } from "aerial-sandbox2";
import { request } from "aerial-common2";
import { fork, call, select } from "redux-saga/effects";
import { createTestProtocolAdapter } from "./utils";
import { createStore, applyMiddleware } from "redux";
import { default as createSagaMiddleware, delay } from "redux-saga";
import { 
  getSyntheticBrowserStore,
  createOpenSyntheticWindowRequest, 
  syntheticBrowserSaga,
  syntheticBrowserReducer,
  createSyntheticBrowserStore
} from "../index";

describe(__filename + "#", () => {

  const createTestStore = (testFiles, run) => {

    const createMainState = () => ({
      dependencyGraph: createDependencyGraph(),
      syntheticBrowserStore: createSyntheticBrowserStore()
    });

    const mainReducer = (state = createMainState(), event) => {
      state = dependencyGraphReducer(state, event);
      state = syntheticBrowserReducer(state, event);
      return state;
    };

    const sagas = createSagaMiddleware();
    const store = createStore(
      mainReducer,
      createMainState(),
      applyMiddleware(sagas)
    )
    sagas.run(function*() {
      // yield fork(createCommonJSSaga());
      yield fork(syntheticBrowserSaga);
      yield fork(createDependencyGraphSaga());
      yield fork(createURIProtocolSaga(createTestProtocolAdapter("local", testFiles)));
      yield call(run);
    });
    return store;
  }

  // xit("can open a new synthetic browser window environment", (next) => {
  //   const { getState, dispatch } = createTestStore({}, function*() {
  //     yield yield request(createOpenSyntheticWindowRequest("http://google.com"));
  //     const { browsers } = getSyntheticBrowserStore(yield select());
  //     expect(browsers.length).to.eql(1);
  //     expect(browsers[0].windows.length).to.eql(1);
  //     expect(browsers[0].windows[0].location).to.eql("http://google.com");
  //     next();
  //   });
  // });
});