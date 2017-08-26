import { RouterRootState } from "../state";
import { LOCATION_CHANGED } from "../actions";
import { select, fork, call, cancel } from "redux-saga/effects";

export const getRouterLocation = (location: Location) => location.hash;

export const whenLocation = (pattern: RegExp, fn: any, ...args: any[]) => fork(function*() {
    const state: RouterRootState = yield select();
    let task;

    while(true) {
      if (state.router && pattern.test(state.router.location)) {
        if (!task) {
          task = yield fork(fn, ...args);
        }
      } else if (task) {
        yield cancel(task);
        task = undefined;
      }
      yield take(LOCATION_CHANGED);
    }
  }
});