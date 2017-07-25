import * as path from "path";
import * as express from "express";
import { parallel } from "mesh";
import { HTTP_SERVER_STARTED, HTTPServerStartedEvent, HTTPServerState } from "./http";
import { 
  Dispatcher, 
  routeTypes, 
  logDebugAction, 
  ImmutableObject, 
  whenStoreChanged,
  StoreChangedEvent,
} from "aerial-common2";

export type FrontEndState = {
  frontEnd: {
    entryPath: string,
    cssPath: string
  }
} & HTTPServerState;

export const initFrontEndService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {

  const addFrontEndRoutes = ({ payload: { frontEnd, http: { expressServer } } }: StoreChangedEvent<FrontEndState>) => {
    if (!expressServer) return;
    const frontEndEntryBasename = path.basename(frontEnd.entryPath);
    const frontEndCSSBasename = path.basename(frontEnd.cssPath);

    expressServer.all("/index.html", (req, res) => {
      res.send(`
        <html>
          <head>
            <link rel="stylesheet" href="./${frontEndCSSBasename}">
          </head>
          <body>
            <div id="application"></div>
            <script type="text/javascript" src="./${frontEndEntryBasename}"></script>
          </body>
        </html>
      `);
    });

    expressServer.use(
      express.static(path.dirname(frontEnd.entryPath))
    );
  };

  return parallel(
    whenStoreChanged((state: FrontEndState) => state.http && state.http.expressServer, addFrontEndRoutes),
    downstream
  );
};