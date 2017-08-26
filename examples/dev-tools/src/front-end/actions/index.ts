export const APPLICATION_STARTED = "APPLICATION_STARTED";
import { BaseEvent } from "aerial-common2";

export type ApplicationStarted = {
  
} & BaseEvent;

export const applicationStarted = (): ApplicationStarted => ({
  type: APPLICATION_STARTED
});