import { LOCATION_CHANGED } from "../actions";
import { select, fork, call, cancel, take } from "redux-saga/effects";
import { RouterApplicationState, ApplicationState } from "../state";

export function* apiFetch(path: string) {
  const { apiHost }: ApplicationState = yield select();
  const response: Response = yield call(fetch, `${location.protocol}//${apiHost}${path}`);
  return yield call(response.json.bind(response));
};