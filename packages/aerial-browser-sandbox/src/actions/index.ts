import { SEnvWindowAddon } from "../environment";
import { Request, BaseEvent, generateDefaultId } from "aerial-common2";

export const OPEN_SYNTHETIC_WINDOW               = "OPEN_SYNTHETIC_WINDOW";
export const NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED = "NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED";
export const SYNTHETIC_WINDOW_SOURCE_CHANGED     = "SYNTHETIC_WINDOW_SOURCE_CHANGED";
export const FETCH_REQUEST                       = "FETCH_REQUEST";

export type FetchRequest = {
  info: RequestInfo;
} & Request;

export type SyntheticWindowSourceChangedEvent = {
  type: string
  syntheticWindowId;
  window: SEnvWindowAddon;
} & BaseEvent;

export type OpenSyntheticBrowserWindowRequest = {
  uri: string;
  syntheticBrowserId: string;
} & Request;

export type NewSyntheticWindowEntryResolvedEvent = {
  location: string;
  syntheticBrowserId?: string;
} & BaseEvent;


export const createSyntheticWindowSourceChangedEvent = (syntheticWindowId: string, window: SEnvWindowAddon): SyntheticWindowSourceChangedEvent => ({
  window,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_SOURCE_CHANGED
});

export const createFetchRequest = (info: RequestInfo): FetchRequest => ({
  info,
  type: FETCH_REQUEST,
  $$id: generateDefaultId()
});

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