import * as Url from "url";
import { BaseEvent } from "aerial-common2";
import { getRouterLocation } from "../utils";
import { LOCATION_CHANGED, PREVIEW_STARTED, INDEX_STARTED, LocationChanged } from "../actions";
import { ApplicationState, RouterRootState, MainPageType } from "../state";

export const mainReducer = (state: ApplicationState, event: BaseEvent) => {
  state = routerReducer(state, event);
  state = routesReducer(state, event);
  return state;
}

export const routerReducer = (state: ApplicationState, event: BaseEvent) => {
  switch(event.type) {
    case LOCATION_CHANGED: {
      const { location } = event as LocationChanged;
      state = {
        ...state, 
        router: {
          ...state.router,
          location: Url.parse(location).hash.substr(1)
        }
     }
     return state;
    }
  }
  return state;
}

export const routesReducer = (state: ApplicationState, event: BaseEvent) => {
  switch(event.type) {
    case PREVIEW_STARTED: {
      const { location } = event as LocationChanged;
      state = {
        ...state,
        mainPage: MainPageType.PREVIEW
      };
     return state;
    }
    case INDEX_STARTED: {
      const { location } = event as LocationChanged;
      state = {
        ...state,
        mainPage: MainPageType.INDEX
      };
     return state;
    }
  }
  return state;
}