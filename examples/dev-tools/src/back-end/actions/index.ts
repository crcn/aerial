import { take, call, put } from "redux-saga/effects";
import { Request } from "express";
import { BaseEvent, Request as BaseRequest, generateDefaultId, createRequestResponse } from "aerial-common2";

export const APPLICATION_STARTED = "APPLICATION_STARTED";
export const HTTP_REQUEST = "HTTP_REQUEST";

export type ApplicationStarted = BaseEvent;

export type HTTPRequest = {
  request: Request,
} & BaseRequest;

export const applicationStarted = (): ApplicationStarted => ({
  type: APPLICATION_STARTED
});

export const httpRequest = (request: Request) => ({
  $id: generateDefaultId(),
  request,
  type: HTTP_REQUEST,
});
