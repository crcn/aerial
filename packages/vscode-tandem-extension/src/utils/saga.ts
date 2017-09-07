import * as express from "express";
import { fork, take, call } from "redux-saga/effects";
import { HTTPRequest, HTTP_REQUEST } from "../actions";

export type TakeEveryHTTPRequestOptions = {
  test: RegExp;
  method?: string;
}

const testHTTPRequestAction = ({ test, method }: TakeEveryHTTPRequestOptions) => (action: HTTPRequest) => action.type === HTTP_REQUEST && test.test(action.request.path) && (!method || action.request.method === method);

export function* routeHTTPRequest (
  ...routes:Array<[TakeEveryHTTPRequestOptions, (req: express.Request, res: express.Response) => any]>
) {

  const findRoute = (action) => routes.find(([options]) => testHTTPRequestAction(options)(action));

  while(true) {
    const action: HTTPRequest = yield take(action => !!findRoute(action));

    const [options, handleRequest] = findRoute(action);
    yield call(handleRequest, action.request, action.response);
  }
};
