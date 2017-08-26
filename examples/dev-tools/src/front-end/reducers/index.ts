import { BaseEvent } from "aerial-common2";
import { ApplicationState, RouterRootState } from "../state";

export const mainReducer = (state: ApplicationState, event: BaseEvent) => {
  state = routerReducer(state, event);
  return state;
}

 export const routerReducer = (state: ApplicationState, event: BaseEvent) => {
   return state;
 }