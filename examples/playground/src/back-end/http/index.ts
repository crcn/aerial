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

export const getHTTPServer = weakMemo((config: HTTPConfig) => {
  const server   = express();
  return server.listen(config.http.port);
});

// export const httpDispatcher = (upstream: Dispatcher<any>) => {
//   return (downstream: Dispatcher<any>) => {
//     return downstream;
//   };
// };