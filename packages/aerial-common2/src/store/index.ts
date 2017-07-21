import { reader } from "../monad";
import { createStore, Reducer, Store } from "redux";
import { mutable, immutable, ImmutableObject } from "../immutable";
import { parallel, readAll, proxy, createDeferredPromise } from "mesh";
import { Dispatcher, DispatcherContextIdentity, Message, whenNotType, Event } from "../bus";

export const STORE_CHANGED = "STORE_CHANGED";

export type StoreChangedEvent<TState> = {
  payload: TState
} & Event;

export const storeChangedEvent = <TState>(state: TState): StoreChangedEvent<TState> => ({ type: STORE_CHANGED, payload: state });

export type StoreContextIdentity<T> = {
  store: Store<T>
} & DispatcherContextIdentity;

export type StoreContext<T> = ImmutableObject<StoreContextIdentity<T>>;

export type DownstreamDispatchFactory<TState> = (currentState: TState, upstream: Dispatcher<any>) => Dispatcher<any>;

export const initStoreService = <T>(initialState: T, reducer: Reducer<T>, upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {
  const store = createStore(reducer, initialState);
  
  store.subscribe(() => {
    const newState = store.getState();
    if (initialState !== newState) {
      readAll(upstream(storeChangedEvent(newState)));
    }
  });

  return parallel(whenNotType(STORE_CHANGED, (message) => {
    store.dispatch(message);
  }), downstream);
};