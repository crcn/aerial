import { readAll } from "mesh";
import { weakMemo } from "../memo";
import { identity } from "lodash";
import { BaseEvent, Dispatcher, publicObject } from "./base";

export type WrappedEvent = {
  sourceEvent: any
} & BaseEvent;

export const wrappedEvent = (type: string, sourceEvent: any, map = (event: any) => ({})) => ({
  type,
  sourceEvent,
  ...map(sourceEvent)
});

export const wrapEventToDispatch = weakMemo((type: string, dispatch: Dispatcher<any>, map = (event: any) => ({})) => (sourceEvent: any) => {
  readAll(dispatch(wrappedEvent(type, sourceEvent)));
});

export const wrapEventToPublicDispatch = weakMemo((type: string, dispatch: Dispatcher<any>, map = (event: any) => ({})) => (sourceEvent: any) => {
  readAll(dispatch(publicObject(identity)(wrappedEvent(type, sourceEvent))));
});