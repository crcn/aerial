import { delay } from "redux-saga";
import { Selector, createSelector } from "reselect";
import { call, select, fork } from "redux-saga/effects";

export function* watch<T, U>(selector: Selector<T, U>, onChange: (value: U, state?: T) => any) {
  let currentValue = null;
  yield fork(function*() {
    while(true) {
      const newValue = yield select(selector);
      if (currentValue !== newValue) {
        if ((yield call(onChange, currentValue = newValue, yield select())) !== true) {
          break;
        }
      }
      yield call(delay, 50);
    }
  });
}