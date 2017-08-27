import { LOCATION_CHANGED } from "../actions";
import { RouterApplicationState, ApplicationState } from "../state";
import { select, fork, call, cancel, take } from "redux-saga/effects";

export const getRouterLocation = (location: Location) => location.hash && location.hash.substr(1);

export const whenLocation = (pattern: RegExp, fn: any, ...args: any[]) => fork(function*() {
  let task;
  let location: string;

  while(true) {
    const state: RouterApplicationState = yield select();
    if (state.router && pattern.test(state.router.location)) {
      if (!task || location !== state.router.location) {
        location = state.router.location;
        task = yield fork(fn, ...args);
      }
    } else if (task) {
      yield cancel(task);
      task = undefined;
    }
    yield take(LOCATION_CHANGED);
  }
});