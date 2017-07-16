import * as http from "http";
import { sequence } from "mesh";
import * as express from "express";
import { BackendConfig } from "../application";
import { Dispatcher, weakMemo, ImmutableObject, Event, createEvent } from "aerial-common2";

export type HTTPConfig = {
  http: {
    port: number
  }
};

export type HTTPServerConnectedEvent = {
  server: http.Server
} & Event;

export const startExpressServer = (config: HTTPConfig) => {
  const expressServer   = express();
  return {
    expressServer,
    httpServer: expressServer.listen(config.http.port)
  };
};
