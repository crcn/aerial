import { sequence } from "mesh";
import { identity, noop } from "lodash";
import { store, Reducer } from "../store";
import { ImmutableObject } from "../immutable";
import { Dispatcher, createMessage, Message, Event } from "../bus";

export enum ApplicationStatusTypes {
  LOADING      = "LOADING",
  INITIALIZING = "INITIALIZING",
  READY        = "READY"
};

export enum ApplicationEventTypes {
  LOADED     = "LOADED",
  INITALIZED = "INITALIZED"
};

export const appEvent = (type: ApplicationEventTypes) => createMessage(type);

export type ApplicationState = ImmutableObject<{
  status: ApplicationStatusTypes
}>;

export type ApplicationConfig = { };

export type Bootstrapper<TConfig extends ApplicationConfig, UState extends ApplicationState> = (config: TConfig, state: UState, upstreamDispatch: Dispatcher<any>, downstreamDispatch?: Dispatcher<any>) => Dispatcher<any>;

const appStateReducer = <TState extends ApplicationState>(child: Reducer<TState> = identity) => (state: TState, event: Event) => {
  switch(event.type) {
    case ApplicationEventTypes.LOADED: return state.set("status", ApplicationStatusTypes.INITIALIZING);
    case ApplicationEventTypes.INITALIZED: return state.set("status", ApplicationStatusTypes.READY)
  }
  return child(state, event);
};

export const bootstrapper = <TConfig extends ApplicationConfig, UState extends ApplicationState>(child: Bootstrapper<TConfig, any>, reduce?: Reducer<UState>) => (
  (config: TConfig, state: UState, upstreamDispatch: Dispatcher<any> = noop) => (
    store(state, appStateReducer<UState>(reduce), (state, upstreamDispatch) => sequence(
      child(config, state, upstreamDispatch, (message: Message) => {
        switch(state.status) {
          case ApplicationStatusTypes.LOADING: return upstreamDispatch(appEvent(ApplicationEventTypes.LOADED));
          case ApplicationStatusTypes.INITIALIZING: return upstreamDispatch(appEvent(ApplicationEventTypes.INITALIZED));
        }
      })
    ))
  )
);