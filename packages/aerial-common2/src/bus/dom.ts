import { readAll } from "mesh";
import { weakMemo } from "../memo";
import { identity } from "lodash";
import { BaseEvent, Dispatcher } from "./base";

export type WrappedEvent = {
  sourceEvent: any
} & BaseEvent;


export const wrapEventToDispatch = weakMemo((type: string, dispatch: Dispatcher<any>, map = (event: any) => ({})) => (sourceEvent: any) => {
  readAll(dispatch({
    type,
    sourceEvent,
    ...map(sourceEvent)
  }));
});