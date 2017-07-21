import * as http from "http";
import * as express from "express";
import { readAll, parallel } from "mesh";
import { 
  routeTypes, 
  LOAD_APP, 
  Dispatcher, 
  Event, 
  ImmutableObject,
  Message, 
  initStoreService,
  immutable,
  logger, 
  StoreChangedEvent,
  logInfoAction,
  whenStoreChanged,
} from "aerial-common2";

export type HTTPServerStartedEvent = {
  httpServer: http.Server,
  expressServer: express.Express,
} & Event;

export type HTTPServerState = {
  http: {
    port: number,
    expressServer: express.Express,
    httpServer: http.Server,
  }
}

export const HTTP_SERVER_STARTED = "HTTP_SERVER_STARTED";

export const httpServerStartedEvent = (expressServer: express.Express, httpServer: http.Server): HTTPServerStartedEvent => ({
  type: HTTP_SERVER_STARTED,
  expressServer,
  httpServer,
});

export const httpServerReducer = (state: HTTPServerState, event: Event) => {
  switch(event.type) {
    case HTTP_SERVER_STARTED: return immutable({
      ...state,
      http: {
        ...state.http,
        expressServer: (event as HTTPServerStartedEvent).expressServer,
        httpServer: (event as HTTPServerStartedEvent).httpServer
      }
    });
  }
  return state;
};

export const initHTTPServer = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {
  const log = logger(upstream);

  const startServer = ({ payload: { http }}: StoreChangedEvent<HTTPServerState>) => {
    log(logInfoAction(`starting HTTP server on port ${http.port}`));
    const expressServer = express();
    const httpServer    = expressServer.listen(http.port);
    readAll(upstream(httpServerStartedEvent(expressServer, httpServer)));
  };

  return parallel(
    whenStoreChanged((state: HTTPServerState) => state.http && state.http.port, startServer),
    downstream
  );
};


