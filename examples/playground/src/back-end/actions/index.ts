import * as express from "express";
import { BaseEvent } from "aerial-common2";

export const LOG = "LOG";
export const HTTP_SERVER_STARTED = "HTTP_SERVER_STARTED";

export type HTTPServerStarted = {
  expressServer: express.Express
} & BaseEvent;

export const log = (text) => ({
  type: LOG,
  text
});
export const httpServerStarted = (expressServer: express.Express): HTTPServerStarted => ({
  type: HTTP_SERVER_STARTED,
  expressServer
});