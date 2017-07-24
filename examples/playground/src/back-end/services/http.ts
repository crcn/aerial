import * as http from "http";
import * as express from "express";
import { parallel } from "mesh";
import { 
  logger, 
  Message, 
  LOAD_APP, 
  BaseEvent, 
  immutable,
  Dispatcher, 
  routeTypes, 
  logInfoAction,
  ImmutableObject,
  whenStoreChanged,
  initStoreService,
  StoreChangedEvent,
} from "aerial-common2";

export type HTTPServerStartedEvent = {
  httpServer: http.Server,
  expressServer: express.Express,
} & BaseEvent;

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

export const httpServerReducer = (state: HTTPServerState, event: BaseEvent) => {
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
    return upstream(httpServerStartedEvent(expressServer, httpServer));
  };

  return parallel(
    whenStoreChanged((state: HTTPServerState) => state.http && state.http.port, startServer),
    downstream
  );
};


