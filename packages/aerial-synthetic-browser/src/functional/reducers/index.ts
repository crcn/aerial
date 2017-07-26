import { BaseEvent, updateIn, update, updateStruct, getValueById, deleteValueById } from "aerial-common2";
import { SyntheticBrowser2, createSyntheticBrowserWindow2 } from "../state";
import { 
  OPEN_SYNTHETIC_WINDOW_REQUESTED, 
  OpenSyntheticWindowRequested, 
  CLOSE_SYNTHETIC_WINDOW_REQUESTED,
  CloseSyntheticWindowRequested
} from "../messages";

export const mainReducer = (state: SyntheticBrowser2, event: BaseEvent) => {

  switch(event.type) {
    case OPEN_SYNTHETIC_WINDOW_REQUESTED: {
      const { location } = event as OpenSyntheticWindowRequested;
      return update(state, "windows", state.windows.concat(createSyntheticBrowserWindow2({
        location
      })));
    }

    case CLOSE_SYNTHETIC_WINDOW_REQUESTED: {
      const { syntheticWindowId } = event as CloseSyntheticWindowRequested;
      return deleteValueById(state, syntheticWindowId);
    }
  }

  return state;
};