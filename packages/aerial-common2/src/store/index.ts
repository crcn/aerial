import { createDeferredPromise, readAll } from "mesh";
import { Message, Dispatcher } from "../bus";

/*

// creates stateful dispatchers based on the passed in state

const dispatch = store({}, reduce, (state, dispatch) => {

});
*/

export const store = <T>(state: T, reduce: (state: T, message: Message) => T, dispatcher: (state: T, dispatch: Dispatcher<Message>) => any) => {

  let currentDispatch: Dispatcher<Message>;
  let currentState = state;

  const reset = () => {
    return currentDispatch = dispatcher(currentState, (message: Message) => {
      const newState = reduce(currentState, message);
      if (newState !== currentState) {
        currentState = newState;
        return reset()(message);
      } else {
        return currentDispatch(message);
      }
    });
  };
  
  reset();

  return (message: Message) => currentDispatch(message);
}