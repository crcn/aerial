import { reader } from "../monad";
// import { DuplexStream, pump as pumpLegacy } from "mesh7";
import { negate, noop } from "lodash";
import { ImmutableObject } from "../immutable";

import { when, readAll, proxy, pump, createQueue, createDeferredPromise, createDuplex, wrapAsyncIterableIterator, remote } from "mesh";

export type Message = {
  type: string;
}

// trigger something to do
export type Action = Message;

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
export type HODispatcher<T extends Message> = (dispatch: Dispatcher<any>) => (message: T) => any;

export const messageTypeIs = (type: string | string[]) => {
  const types = Array.isArray(type) ? type : [type];
  return (m: Message) => types.indexOf(m.type) !== -1;
}

export type MessageRoutes = {
  [identifier: string]: Dispatcher<any>
};

export const routeTypes = (routes: MessageRoutes) => (message: Message) => (routes[message.type] || noop)(message);

export const whenNotType = (type: string | string[], _then?: Dispatcher<any>, _else?: Dispatcher<any>) => {
  return when(negate(messageTypeIs(type)), _then, _else);
}

export const whenType = (type: string | string[], _then?: Dispatcher<any>, _else?: Dispatcher<any>) => {
  return when(messageTypeIs(type), _then, _else);
}

export type DispatcherContextIdentity = {
  upstream: Dispatcher<any>,
  downstream: Dispatcher<any>
};

export type DispatcherContext = ImmutableObject<DispatcherContextIdentity>;

export const attachMessageMetadata = (name: string, value: any) => <TFactory extends Function>(create: TFactory) => ((...args) => {
  const instance = create(...args);
  Reflect.defineMetadata(name, value, instance);
  return instance;
});

export const publicObject  = attachMessageMetadata("message:public", true);
export const isObjectPublic = (value: any) => Reflect.getMetadata("message:public", value) === true;


export const whenPublicMessage = (_then: Dispatcher<any>, _else?: Dispatcher<any>) => when(isObjectPublic, _then, _else);

/*

const dispatch = parallel(
  whenType("keep open", (message) => {

  });
)

const chan = channel(dispatch({ type: "keep open" }));

*/

// export const channel = (iterable: AsyncIterableIterator<any>, upstream: (...args) => any) => {
//   const q = createQueue();
//   return remote(() => ({
//     adapter: {
//       send(message) {
//         iterable.next(message).then(({ value }) => q.unshift(value));
//       },
//       addListener(listener) {
//         pump(q, listener);
//       }
//     }
//   }), upstream);
// };

// export const channelIterable = (upstream: (...args) => any) => {
//   const q = createQueue();
//   channel()
// };