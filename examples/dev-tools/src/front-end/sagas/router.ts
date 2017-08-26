import { eventChannel } from 'redux-saga';
import { locationChanged } from "../actions";
import { fork, put, spawn, take } from "redux-saga/effects";

export function* routerSaga() {
  yield fork(handleHistoryChange);
}

function* handleHistoryChange() {

  const chan = eventChannel((emit) => {

    window.onpopstate = () => {
      emit(locationChanged(window.location.hash));
    };

    return () => {};
  });

  while(true) {
    const event = yield take(chan);
    yield spawn(function*() {
      yield put(event);
    });
  }
}