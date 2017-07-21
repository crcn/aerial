import * as http from "http";
import * as express from "express";
import { readAll, parallel } from "mesh";
import { routeTypes, LOAD_APP, Dispatcher, Event, Message, initStoreService, logger, logInfoAction } from "aerial-common2";

export type HTTPServerStartedEvent = {
  httpServer: http.Server,
  expressServer: express.Express,
} & Event;

export type HTTPConfig = {
  http: {
    port: number
  }
}

export const HTTP_SERVER_STARTED = "HTTP_SERVER_STARTED";

export const httpServerStartedEvent = (expressServer: express.Express, httpServer: http.Server): HTTPServerStartedEvent => ({
  type: HTTP_SERVER_STARTED,
  expressServer,
  httpServer,
});

export const initHTTPServer = (config: HTTPConfig, upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {
  const log = logger(upstream);

  const load = () => {
    log(logInfoAction(`starting HTTP server on port ${config.http.port}`));
    
    const expressServer = express();
    const httpServer    = expressServer.listen(config.http.port);
    readAll(upstream(httpServerStartedEvent(expressServer, httpServer)));
  };

  return parallel(routeTypes({
    [LOAD_APP]: load
  }), downstream);
};


