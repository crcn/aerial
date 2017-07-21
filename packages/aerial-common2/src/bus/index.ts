import { reader } from "../monad";
import { negate, noop } from "lodash";
import { when, readAll, proxy, createDeferredPromise } from "mesh";
import { ImmutableObject } from "../immutable";

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

export type MessageRoutes = {
  [identifier: string]: Dispatcher<any>
};

export const routeTypes = (routes: MessageRoutes) => (message: Message) => (routes[message.type] || noop)(message);

export const whenNotType = (type: string | string[], _then?: Dispatcher<any>, _else?: Dispatcher<any>) => {
  return when(negate(messageTypeIs(type)), _then, _else);
}

export type DispatcherContextIdentity = {
  upstream: Dispatcher<any>,
  downstream: Dispatcher<any>
};

export type DispatcherContext = ImmutableObject<DispatcherContextIdentity>;

export const loopedDispatcher = (createDownstreamDispatcher: (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => Dispatcher<any>) => (downstream: Dispatcher<any> = noop) => {
  const { promise: upstreamPromise, resolve: resolveUpstreamDispatcher } = createDeferredPromise<Dispatcher<any>>();
  const topDispatcher = createDownstreamDispatcher(proxy(() => upstreamPromise))(downstream);
  resolveUpstreamDispatcher(topDispatcher);
  return topDispatcher;
}