import { eventChannel } from 'redux-saga';
import { fork, put, spawn } from "redux-saga/effects";
import { locationChanged } from "../actions";

export function* routerSaga() {
  yield fork(handleHistoryChange);
}

function* handleHistoryChange() {

  const chan = eventChannel((emit) => {

    window.onpopstate = () => {
      emit(locationChanged(window.location.toString()))
    };

    return () => {};
  });

  while(true) {
    const event = yield chan;
    yield spawn(function*() {
      yield put(event);
    });
  }
}