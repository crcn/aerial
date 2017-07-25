import { reader } from "../monad";
import { Selector } from "reselect";
import { createStore, Reducer, Store } from "redux";
import { mutable, immutable, ImmutableObject } from "../immutable";
import { parallel, readAll, proxy, createDeferredPromise, when, readOne } from "mesh";
import { Dispatcher, DispatcherContextIdentity, Message, whenNotType, whenType, BaseEvent } from "../bus";

export const STORE_CHANGED = "STORE_CHANGED";
export const GET_STORE_STATE = "GET_STORE_STATE";

export type StoreChangedEvent<TState> = {
  payload: TState
} & BaseEvent;

export const getStoreStateAction = () => ({ type: GET_STORE_STATE });

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

    // TODO - dispatch diffs instead of the entire store here
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

export const withStoreState = <T>(createDispatcher: (state: T) => Dispatcher<any>, upstream: Dispatcher<any>) => {
  let currentDispatcher;
  let previousState;

  return proxy(async (action) => {
    const newState = await readOne(upstream(getStoreStateAction())) as any;
    if (newState !== previousState) {
      previousState = newState;
      currentDispatcher = createDispatcher(newState);
    }
    return currentDispatcher;
  });
}

export const initStoreService = <T>(initialState: T, reducer: Reducer<T>, upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {
  const store = createStore(reducer, initialState);
  let initialized = false;
  
  store.subscribe(() => {
    const newState = store.getState();
    if (initialState !== newState || !initialized) {
      initialized = true;
      readAll(upstream(storeChangedEvent(newState)));
      return initialized;
    }
  });

  const getStoreState = () => {
    return store.getState();
  }

  return whenType(
    GET_STORE_STATE,
    getStoreState,
    parallel(
      whenNotType(STORE_CHANGED, (message) => {
        store.dispatch(message)
      }),
      downstream
    )
  );
};