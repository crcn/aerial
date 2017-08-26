import { take, call, put } from "redux-saga/effects";
import { Request } from "express";
import { HTTPRequest, HTTP_REQUEST } from "../actions";
import { BaseEvent, Request as BaseRequest, generateDefaultId, createRequestResponse } from "aerial-common2";

export function* takeHTTPRequest(pattern: RegExp, handler: (action: HTTPRequest) => any) {
  const action: HTTPRequest = yield take((action: HTTPRequest) => action.type === HTTP_REQUEST && pattern.test(action.request.path));
  const response = yield call(handler, action);
  yield put(createRequestResponse(action.$id, response));
}