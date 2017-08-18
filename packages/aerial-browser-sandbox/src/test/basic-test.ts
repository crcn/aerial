// import { expect } from "chai";
// import { dependencyGraphReducer, createDependencyGraph, createDependencyGraphSaga, sandboxEnvironmentSaga, sandboxReducer, uriProtocolReducer, createURIProtocolSaga } from "aerial-sandbox2";
// import { request } from "aerial-common2";
// import { fork, call, select } from "redux-saga/effects";
// import { createTestProtocolAdapter } from "./utils";
// import { createStore, applyMiddleware } from "redux";
// import { default as createSagaMiddleware, delay } from "redux-saga";
// import { SyntheticBrowserRootState, createSyntheticBrowserRootState } from "../state";
// import { syntheticBrowserReducer } from "../reducers";
// import { syntheticBrowserSaga } from "../sagas";
// import { getSEnvWindowClass, openSyntheticEnvironmentWindow } from "../environment";
// import { createOpenSyntheticWindowRequest } from "../actions";
// // import { 
// //   getSyntheticBrowserRootState,
// //   createOpenSyntheticWindowRequest, 
// //   syntheticBrowserSaga,
// //   syntheticBrowserReducer,
// //   createSyntheticBrowserRootState
// // } from "../index";

// describe(__filename + "#", () => {

//   const createTestStore = (testFiles, run) => {

//     const createMainState = () => ({
//       dependencyGraph: createDependencyGraph(),
//       SyntheticBrowserRootState: createSyntheticBrowserRootState()
//     });

//     const mainReducer = (state = createMainState(), event) => {
//       state = dependencyGraphReducer(state, event);
//       state = syntheticBrowserReducer(state, event);
//       return state;
//     };

//     const sagas = createSagaMiddleware();
//     const store = createStore(
//       mainReducer,
//       createMainState(),
//       applyMiddleware(sagas)
//     )
//     sagas.run(function*() {
//       // yield fork(createCommonJSSaga());
//       yield fork(syntheticBrowserSaga);
//       yield fork(createDependencyGraphSaga());
//       yield fork(createURIProtocolSaga(createTestProtocolAdapter("local", testFiles)));
//       yield call(run);
//     });
//     return store;
//   }
// });