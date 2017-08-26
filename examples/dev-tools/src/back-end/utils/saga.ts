import { take, call, put } from "redux-saga/effects";
import * as path from "path";
import * as fs from "fs";
import { eventChannel } from "redux-saga";
import { Request } from "express";
import { HTTPRequest, HTTP_REQUEST } from "../actions";
import { BaseEvent, Request as BaseRequest, generateDefaultId, createRequestResponse } from "aerial-common2";

export function* takeHTTPRequest(pattern: RegExp, handler: (action: HTTPRequest) => any) {
  const action: HTTPRequest = yield take((action: HTTPRequest) => action.type === HTTP_REQUEST && pattern.test(action.request.path));
  const response = yield call(handler, action);
  yield put(createRequestResponse(action.$id, response));
};

export function* takeCallback (call: (callback: (err, result) => any) => any) {
  const chan = eventChannel((emit) => {
    call((error, result) => {
      console.log(error, result);
      return emit({ type: "RESULT", error, result });
    });
    return () => { };
  });
  const event = yield chan;
  if (event.error != null) {
    throw event.error;
  }
  return event.result;
};

export const serveStatic = (dirname: string) => function* (action: HTTPRequest) {
  const filepath = path.join(dirname, action.request.path);

  try {
    return yield call(takeCallback, fs.readFile.bind(fs, filepath));
  } catch(e) {
    return "not found";
  }
};