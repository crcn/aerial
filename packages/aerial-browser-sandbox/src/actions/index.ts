import { Request, BaseEvent, generateDefaultId } from "aerial-common2";

export const OPEN_SYNTHETIC_WINDOW = "OPEN_SYNTHETIC_WINDOW";
export const NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED = "NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED";

export type OpenSyntheticBrowserWindowRequest = {
  uri: string;
  syntheticBrowserId: string;
} & Request;

export type NewSyntheticWindowEntryResolvedEvent = {
  location: string;
  syntheticBrowserId?: string;
} & BaseEvent;

export const createOpenSyntheticWindowRequest = (uri: string, syntheticBrowserId: string): OpenSyntheticBrowserWindowRequest => ({
  uri,
  syntheticBrowserId,
  type: OPEN_SYNTHETIC_WINDOW,
  $$id: generateDefaultId()
});

export const createNewSyntheticWindowEntryResolvedEvent = (location: string, syntheticBrowserId?: string): NewSyntheticWindowEntryResolvedEvent => ({
  location,
  syntheticBrowserId,
  type: NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
});