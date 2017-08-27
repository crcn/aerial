import { take, call, put } from "redux-saga/effects";
import { Request } from "express";
import { BaseEvent, Request as BaseRequest, generateDefaultId, createRequestResponse } from "aerial-common2";

export const APPLICATION_STARTED = "APPLICATION_STARTED";
export const HTTP_REQUEST = "HTTP_REQUEST";
export const FILE_ADDED = "FILE_ADDED";
export const FILE_REMOVED = "FILE_REMOVED";
export const FILE_CHANGED = "FILE_CHANGED";

export type ApplicationStarted = BaseEvent;

export type FileEvent = {
  path: string;
} & BaseEvent;

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

export const fileAdded = (path: string): FileEvent => ({
  path,
  type: FILE_ADDED
});

export const fileRemoved = (path: string): FileEvent => ({
  path,
  type: FILE_REMOVED
});

export const fileChanged = (path: string): FileEvent => ({
  path,
  type: FILE_CHANGED
});