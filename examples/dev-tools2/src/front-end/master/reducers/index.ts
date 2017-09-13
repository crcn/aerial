import { BaseEvent, arrayRemoveItem, arraySplice } from "aerial-common2";
import { FILE_ADDED, FILE_REMOVED, FileAction, getFilePathHash } from "../../../common";
import { ApplicationState, addEntryFilePath, removeEntryFilePath } from "../state";

export function mainReducer(state: ApplicationState, event: BaseEvent) {
  switch(event.type) {
    case FILE_ADDED: {
      const { filePath } = event as FileAction;
      return addEntryFilePath(state, filePath);
    }
    case FILE_REMOVED: {
      const { filePath } = event as FileAction;
      return removeEntryFilePath(state, filePath);
    }
  }
  return state;
}
