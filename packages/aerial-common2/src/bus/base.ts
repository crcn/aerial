import { reader } from "../monad";
// import { DuplexStream, pump as pumpLegacy } from "mesh7";
import { negate, noop } from "lodash";
import { ImmutableObject } from "../immutable";
import { take, fork, call, put, spawn } from "redux-saga/effects";
import { IDd, generateDefaultId } from "../struct";


export type Message = {
  type: string;
}

// trigger something to do
export type Action = Message;

// Events are things that have happened -- loaded, initialized, and so forth. 
// BaseEvent is used since Event is already taken
export type BaseEvent = Message;

export const RESPONSE = "RESPONSE";

// trigger something to do
export type Request = {
  type: string
} & IDd;

export type Response<T> = {
  requestId: string;
  payload: T;
} & Action;

export const createMessage = (type: string, rest: any = {}): Message => ({
  ...rest,
  type,
});

export const createAction = createMessage;
export const createEvent = createMessage;

export type Dispatcher<T extends Message> = (message: T) => any;

export const attachActionMetadata = (name: string, value: any) => <TFactory extends Function>(create: TFactory) => ((...args) => {
  const instance = create(...args);
  Reflect.defineMetadata(name, value, instance);
  return instance;
});

export const publicObject  = attachActionMetadata("message:public", true);
export const isObjectPublic = (value: any) => Reflect.getMetadata("message:public", value) === true;

export const createRequestResponse = <T>(requestId: string, payload: T): Response<T> => ({
  type: RESPONSE,
  requestId,
  payload
});

export const takeResponse = (requestId: string) => {
  return take((response: Response<any>) => {
    return response.type === RESPONSE && response.requestId === requestId;
  });
}

export const request = (request: Request) => call(function*() {
  yield put(request);
  return takeResponse(request.$id);
});

export const reuseRequest = (request: Request): Request => ({ 
  ...(request as any), 
  $id: generateDefaultId()
});

export const takeRequest = (test: string | ((action: Action) => boolean), handleRequest: (request: Request) => any) => call(function*() {
  const request = (yield take(test)) as Request;
  yield fork(function*() {
    yield put(createRequestResponse(request.$id, yield call(handleRequest, request)));
  });
});
