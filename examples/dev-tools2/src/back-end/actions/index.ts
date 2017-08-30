import { BaseEvent } from "aerial-common2";
import { Express } from "express";

export const APPLICATION_STARTED = "APPLICATION_STARTED";
export const EXPRESS_SERVER_STARTED = "EXPRESS_SERVER_STARTED";

export type ExpressServerStarted = {
  expressServer: Express
} & BaseEvent;

export const applicationStarted = () => ({ 
  type: APPLICATION_STARTED
});

export const expressServerStarted = (expressServer: Express) => ({
  expressServer,
  type: EXPRESS_SERVER_STARTED
})