const Mousetrap = require("mousetrap");

import { eventChannel } from "redux-saga";
import { select, put, take } from "redux-saga/effects";
import { ShortcutServiceState } from "front-end/state";

export function* shortcutsService() {
  const state: ShortcutServiceState = yield select();
  const mt = Mousetrap();
  const chan = eventChannel((emit) => {
    for (const { keyCombo, action } of state.shortcuts) {
      mt.bind(keyCombo, (event) => {
        event.preventDefault();
        emit({...action});
      })
    }
    return () => {

    }
  });
  while(true) {
    yield put(yield take(chan));
  }
}