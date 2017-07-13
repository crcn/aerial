import { createDeferredPromise, readAll, proxy, sequence, limit } from "mesh";
import { Message, Dispatcher } from "../bus";

/*

// creates stateful dispatchers based on the passed in state

const dispatch = store({}, reduce, (state, dispatch) => {

});
*/

export const store = <T>(state: T, reduce: (state: T, message: Message) => T, dispatcher: (state: T, dispatch: Dispatcher<Message>) => any) => {

  const reset = (currentState: T) => {
    let internalDispatch = dispatcher(currentState, (message: Message) => {
      const newState = reduce(currentState, message);
      if (currentState !== newState) {
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