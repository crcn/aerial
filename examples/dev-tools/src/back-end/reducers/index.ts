import { FILE_REMOVED, FILE_ADDED, FILE_CHANGED, FileEvent } from "../actions";
import { BaseEvent, arrayRemoveItem, arraySplice } from "aerial-common2";
import { ApplicationState } from "../state";

export const mainReducer = (state: ApplicationState, event: BaseEvent) => {
  state = filesReducer(state, event);
  return state;
}

const filesReducer = (state: ApplicationState, event: BaseEvent) => {
  switch(event.type) {
    case FILE_REMOVED: {
      const { path } = event as FileEvent;
      state = {
        ...state,
        watchingFilePaths: arrayRemoveItem(state.watchingFilePaths, path)
      };
      return state;
    }
    case FILE_ADDED: {
      const { path } = event as FileEvent;
      state = {
        ...state,
        watchingFilePaths: arraySplice(state.watchingFilePaths, 0, 0, path)
      };
      return state;
    }
  }
  return state;
};