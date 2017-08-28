import { BaseEvent, Request as BaseRequest, generateDefaultId, createRequestResponse } from "aerial-common2";
import { publicActionFactory } from "../../common";

export const APPLICATION_STARTED = "APPLICATION_STARTED";
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

export const fileAdded = publicActionFactory((path: string): FileEvent => ({
  path,
  type: FILE_ADDED
}));

export const fileRemoved = publicActionFactory((path: string): FileEvent => ({
  path,
  type: FILE_REMOVED
}));

export const fileChanged = publicActionFactory((path: string): FileEvent => ({
  path,
  type: FILE_CHANGED
}));