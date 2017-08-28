import * as Url from "url";
import { BaseEvent } from "aerial-common2";
import { getRouterLocation } from "../utils";
import { 
  WatchingFiles,
  LOCATION_CHANGED, 
  PREVIEW_STARTED, 
  INDEX_STARTED, 
  LocationChanged,
  WATCHING_FILES,
} from "../actions";
import { ApplicationState, RouterApplicationState, MainPageType } from "../state";

const DEFAULT_WINDOW_WIDTH  = 400;
const DEFAULT_WINDOW_HEIGHT = 768;

export const mainReducer = (state: ApplicationState, event: BaseEvent) => {
  state = routerReducer(state, event);
  state = routesReducer(state, event);
  state = indexPageReducer(state, event);
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

export const indexPageReducer = (state: ApplicationState, event: BaseEvent) => {
  console.log(event);
  switch(event.type) {
    case INDEX_STARTED: {
      state = {
        ...state,
        indexPage: {
          childWindows: []
        }
      };
      return state;
    }
    case WATCHING_FILES: {
      const { filePaths } = event as WatchingFiles;
      const newChildWindows = filePaths.map((filePath) => {
        return state.indexPage.childWindows.find((window) => window.location.indexOf(filePath) !== -1) ||{
          location: `${location.protocol}//${location.host}#/files/${filePath}`,
          bounds: {
            left: 0,
            top: 0,
            right: DEFAULT_WINDOW_WIDTH,
            bottom: DEFAULT_WINDOW_HEIGHT
          }
        }
      });

      state = {
        ...state,
        indexPage: {
          childWindows: newChildWindows
        }
      };
      return state;
    }
  }
  return state;
};