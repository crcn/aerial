import { when, readAll } from "mesh";
import { negate } from "lodash";

export type Message = {
  type: string;
}

// trigger something to do
export type Action = Message;

// Events are things that have happened -- loaded, initialized, and so forth. 
export type Event = Message;

export const createMessage = (type: string, rest: any = {}): Message => ({
  ...rest,
  type,
});

export const createAction = createMessage;
export const createEvent = createMessage;

export type Dispatcher<T extends Message> = (message: T) => any;

export const messageTypeIs = (type: string | string[]) => {
  const types = Array.isArray(type) ? type : [type];
  return (m: Message) => types.indexOf(m.type) !== -1;
}

export const whenType = (type: string | string[], _then?: Dispatcher<any>, _else?: Dispatcher<any>) => {
  return when(messageTypeIs(type), _then, _else);
}

export const whenNotType = (type: string | string[], _then?: Dispatcher<any>, _else?: Dispatcher<any>) => {
  return when(negate(messageTypeIs(type)), _then, _else);
}
