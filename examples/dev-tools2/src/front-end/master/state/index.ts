import { BaseApplicationState, arrayRemoveItem, arraySplice } from "aerial-common2";
import { getFilePathHash } from "../../../common";

export type ApplicationState = {
  entryHashes: string[]
} & BaseApplicationState;

export const updateApplicationState = (state: ApplicationState, properties: Partial<ApplicationState>) => ({
  ...state,
  ...properties
});

export const addEntryFilePath = (state: ApplicationState, filePath: string) => addEntryHash(state, getFilePathHash(filePath));
export const removeEntryFilePath = (state: ApplicationState, filePath: string) => removeEntryHash(state, getFilePathHash(filePath));

export const addEntryHash = (state: ApplicationState, hash: string) => {
  if (state.entryHashes.indexOf(hash) !== -1) { 
    return state;
  }

  return updateApplicationState(state, {
    entryHashes: arraySplice(state.entryHashes, state.entryHashes.length, 0, hash)
  });
}

export const removeEntryHash = (state: ApplicationState, hash: string) => {
  return updateApplicationState(state, {
    entryHashes: arrayRemoveItem(state.entryHashes, hash)
  });
}