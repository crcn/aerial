// import { SEnvWindowInterface } from "../environment";
import { SyntheticDocument } from "../state";
import { RenderedClientRects } from "../environment";
import { Request, BaseEvent, generateDefaultId } from "aerial-common2";

export const OPEN_SYNTHETIC_WINDOW               = "OPEN_SYNTHETIC_WINDOW";
export const SYNTHETIC_WINDOW_RESOURCE_LOADED    = "SYNTHETIC_WINDOW_RESOURCE_LOADED";
export const NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED = "NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED";
export const SYNTHETIC_WINDOW_SOURCE_CHANGED     = "SYNTHETIC_WINDOW_SOURCE_CHANGED";
export const FETCH_REQUEST                       = "FETCH_REQUEST";
export const SYNTHETIC_WINDOW_RECTS_UPDATED      = "SYNTHETIC_WINDOW_RECTS_UPDATED";
export const SYNTHETIC_WINDOW_LOADED             = "SYNTHETIC_WINDOW_LOADED";

export type FetchRequest = {
  info: RequestInfo;
} & Request;

export type SyntheticWindowSourceChangedEvent = {
  type: string
  syntheticWindowId: string;
  window: any;
} & BaseEvent;

export type OpenSyntheticBrowserWindowRequest = {
  uri: string;
  syntheticBrowserId: string;
} & Request;

export type NewSyntheticWindowEntryResolvedEvent = {
  location: string;
  syntheticBrowserId?: string;
} & BaseEvent;

export type SyntheticWindowRectsUpdatedEvent = {
  rects: RenderedClientRects;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticWindowLoadedEvent = {
  document: SyntheticDocument;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticWindowResourceLoadedEvent = {
  uri: string;
  syntheticWindowId: string;
} & BaseEvent;


export const createSyntheticWindowSourceChangedEvent = (syntheticWindowId: string, window: any): SyntheticWindowSourceChangedEvent => ({
  window,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_SOURCE_CHANGED
});

export const createFetchRequest = (info: RequestInfo): FetchRequest => ({
  info,
  type: FETCH_REQUEST,
  $$id: generateDefaultId()
});

export const createOpenSyntheticWindowRequest = (uri: string, syntheticBrowserId?: string): OpenSyntheticBrowserWindowRequest => ({
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

export const createSyntheticWindowRectsUpdated = (syntheticWindowId: string, rects: RenderedClientRects): SyntheticWindowRectsUpdatedEvent => ({
  syntheticWindowId,
  rects,
  type: SYNTHETIC_WINDOW_RECTS_UPDATED,
});


export const createSyntheticWindowResourceLoadedEvent = (syntheticWindowId: string, uri: string): SyntheticWindowResourceLoadedEvent => ({
  uri,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_RESOURCE_LOADED,
});

export const createSyntheticWindowLoadedEvent = (syntheticWindowId: string, document: SyntheticDocument): SyntheticWindowLoadedEvent => ({
  syntheticWindowId,
  document,
  type: SYNTHETIC_WINDOW_LOADED,
});