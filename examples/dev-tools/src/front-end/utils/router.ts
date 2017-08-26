import { RouterRootState } from "../state";
import { LOCATION_CHANGED } from "../actions";
import { select, fork, call } from "redux-saga/effects";

export const getRouterLocation = (location: Location) => location.hash;

export const whenLocation = (pattern: RegExp, fn: any, ...args: any[]) => fork(function*() {
    const state: RouterRootState = yield select();
    while(true) {
      if (state.router && pattern.test(state.router.location)) {
        yield fork(fn, ...args);
      }
      yield take(LOCATION_CHANGED);
    }
  }
});