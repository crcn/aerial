import { routerSaga } from "./router";
import { routesSaga } from "./routes";
import { childWindowSaga } from "./child-window";
import { fork } from "redux-saga/effects";

export function* mainSaga() { 
  yield fork(routerSaga);
  yield fork(routesSaga);
  yield fork(childWindowSaga);
}