import { routerSaga } from "./router"
import { fork } from "redux-saga/effects";
export function* mainSaga() { 
  yield fork(routerSaga);
}