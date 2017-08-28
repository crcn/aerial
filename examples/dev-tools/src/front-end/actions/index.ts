import { BaseEvent } from "aerial-common2";
import { publicActionFactory } from "../../common";

export const REDIRECT = "REDIRECT";
export const LOCATION_CHANGED = "LOCATION_CHANGE";
export const APPLICATION_STARTED = "APPLICATION_STARTED";
export const PREVIEW_STARTED = "PREVIEW_STARTED";
export const INDEX_STARTED = "INDEX_STARTED";
export const WATCHING_FILES = "WATCHING_FILES";

export type LocationChanged = {
  location: string
} & BaseEvent;

export type PreviewStarted = BaseEvent;
export type IndexStarted = BaseEvent;

export type ApplicationStarted = {
  
} & BaseEvent;

export type WatchingFiles = {
  filePaths: string[]
} & BaseEvent;

export type Redirect = {
  
} & BaseEvent;

export const applicationStarted = (): ApplicationStarted => ({
  type: APPLICATION_STARTED
});

export const locationChanged = (location: string): LocationChanged => ({
  location,
  type: LOCATION_CHANGED
});

export const previewStarted = (): PreviewStarted => ({
  type: PREVIEW_STARTED
});

export const indexStarted = (): IndexStarted => ({
  type: INDEX_STARTED
});

export const watchingFiles = (filePaths: string[]): WatchingFiles => ({
  filePaths,
  type: WATCHING_FILES
});