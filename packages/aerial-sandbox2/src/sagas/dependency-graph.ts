import { fork, take } from "redux-saga/effects";
import { 
  AddDependencyGraphItemRequest,
  ADD_DEPENDENCY_GRAPH_ITEM_REQUEST
} from "../actions";

export const createDependencyGraphSaga = () => {
  return function*() {
    fork(handleAddDependencyGraphRequest);
  };
}

function* handleAddDependencyGraphRequest() {
  while(true) {
    const { uri } = (yield take(ADD_DEPENDENCY_GRAPH_ITEM_REQUEST)) as AddDependencyGraphItemRequest;
    console.log("ADDING ", uri);
  }
}