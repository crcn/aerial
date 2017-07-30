import { reader } from "../monad";
// import { DuplexStream, pump as pumpLegacy } from "mesh7";
import { negate, noop } from "lodash";
import { ImmutableObject } from "../immutable";

export type Message = {
  type: string;
}

// trigger something to do
export type Action = Message;

// trigger something to do
export type Request = Action;

// Events are things that have happened -- loaded, initialized, and so forth. 
// BaseEvent is used since Event is already taken
export type BaseEvent = Message;

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

