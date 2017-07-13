import { createDeferredPromise, readAll, proxy, sequence, limit } from "mesh";
import { Message, Event, Dispatcher } from "../bus";

export type Reducer<T> = (state: T, event: Event) => T;

/*

// creates stateful dispatchers based on the passed in state

const dispatch = store({}, reduce, (state, dispatch) => {

});
*/

export const store = <T>(state: T, reduce: Reducer<T>, dispatcher: (state: T, dispatch: Dispatcher<Message>) => any) => {

  const reset = (currentState: T) => {
    let locked = false;
    let internalDispatch = dispatcher(currentState, (message: Message) => {
      if (locked) {
        throw new Error(`Attempting to dispatch ${JSON.stringify(message)} after state change.`);
      }
      const newState = reduce(currentState, message);
      if (currentState !== newState) {
        locked = true;
        return reset(newState)(message);
      } else {
        return internalDispatch(message);
      }
    });
    return internalDispatch;
  };

  // functionality should be frozen along with the state
  // passed into the store func.
  return reset(state);
}