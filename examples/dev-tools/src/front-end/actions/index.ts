import { BaseEvent } from "aerial-common2";

export const LOCATION_CHANGED = "LOCATION_CHANGE";
export const APPLICATION_STARTED = "APPLICATION_STARTED";
export const REDIRECT = "REDIRECT";

export type LocationChanged = {
  location: string
} & BaseEvent;

export type ApplicationStarted = {
  
} & BaseEvent;

export type Redirect = {
  
} & BaseEvent;

export const applicationStarted = (): ApplicationStarted => ({
  type: APPLICATION_STARTED
});

export const locationChanged = (location: string): LocationChanged => ({
  location,
  type: LOCATION_CHANGED
})