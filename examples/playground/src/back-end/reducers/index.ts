import { httpServerStarted, HTTP_SERVER_STARTED, HTTPServerStarted } from "../actions";
import { BaseEvent, updateIn } from "aerial-common2";
import { ApplicationState } from "../state";

export const mainReducer = (state: ApplicationState, event: BaseEvent) => {
  switch(event.type) {
    case HTTP_SERVER_STARTED: {
      const { expressServer } = event as HTTPServerStarted;
      return updateIn(state, ["http", "expressServer"], expressServer);
    }
  }
  return state;
};