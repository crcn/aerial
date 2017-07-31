import { expect } from "chai";
import { createStore, applyMiddleware } from "redux";
import { default as createSagaMiddleware } from "redux-saga";

import { 
  createCachedFile,
  createDependency,
  createDependencyGraph,
  dependencyGraphReducer, 
  createDependencyGraphSaga, 
  createAddDependencyGraphItemRequest,
} from "../index";

describe(__filename + "#", () => {

  const createTestStore = () => {
    const sagas = createSagaMiddleware();
    const store = createStore(
      dependencyGraphReducer,
      createDependencyGraph(),
      applyMiddleware(sagas)
    )
    sagas.run(createDependencyGraphSaga());
    return store;
  }
  
  it("can add a dependency to the dependency graph", () => {
    const { getState, dispatch } = createTestStore();
    dispatch(createAddDependencyGraphItemRequest("local://index.html"));
  });
});