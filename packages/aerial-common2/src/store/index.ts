import { reader } from "../monad";
import { Selector } from "reselect";
import { createStore, Reducer, Store } from "redux";
import { mutable, immutable, ImmutableObject } from "../immutable";
import { parallel, readAll, proxy, createDeferredPromise, when } from "mesh";
import { Dispatcher, DispatcherContextIdentity, Message, whenNotType, BaseEvent } from "../bus";

export const STORE_CHANGED = "STORE_CHANGED";

export type StoreChangedEvent<TState> = {
  payload: TState
} & BaseEvent;

export const storeChangedEvent = <TState>(state: TState): StoreChangedEvent<TState> => ({ type: STORE_CHANGED, payload: state });

export type StoreContextIdentity<T> = {
  store: Store<T>
} & DispatcherContextIdentity;

export type StoreContext<T> = ImmutableObject<StoreContextIdentity<T>>;

export type DownstreamDispatchFactory<TState> = (currentState: TState, upstream: Dispatcher<any>) => Dispatcher<any>;

export const whenStoreChanged = (selector: Selector<any, any>, _then: Dispatcher<any>, _else?: Dispatcher<any>) => {
  let currentState;
  let initialized;
  return when((event: StoreChangedEvent<any>) => {
    if (event.type === STORE_CHANGED) {
      const newState = selector(event.payload);
      if (newState !== currentState || !initialized) {
        initialized = true;
        currentState = newState;
        return true;
      }
    }

    return false;
  }, _then, _else);
}

export const initStoreService = <T>(initialState: T, reducer: Reducer<T>, upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {
  const store = createStore(reducer, initialState);
  let initialized = false;
  
  store.subscribe(() => {
    const newState = store.getState();
    if (initialState !== newState || !initialized) {
      readAll(upstream(storeChangedEvent(newState)));
      return initialized;
    }
  });

  return parallel(whenNotType(STORE_CHANGED, (message) => {
    store.dispatch(message);
  }), downstream);
};