import * as http from "http";
import { sequence } from "mesh";
import * as express from "express";
import { BackendConfig } from "../application";
import { Dispatcher, weakMemo } from "aerial-common2";

export const httpDispatcher = weakMemo((config: BackendConfig, ...handlers: Array<(config: BackendConfig) => (server: http.Server) => any>) => {
  const server   = express();
  const instance = server.listen(config.http.port);
  handlers.forEach(handler => handler(config)(instance));
  return (downstreamDispatch: Dispatcher<any>) => {
    return downstreamDispatch;
  };
});