import { spawn, take, put, fork } from "redux-saga/effects";
import { eventChannel } from "redux-saga";

export function* bubbleEventChannel(subscribe: (emit: any) => () => any) {
  yield spawn(function*() {
    const chan = eventChannel(subscribe);
    while(true) {
      const event = yield take(chan);
      yield fork(function*() {
        yield put(event);
      });
    }
  });
}
