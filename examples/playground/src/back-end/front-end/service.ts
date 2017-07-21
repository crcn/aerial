import * as path from "path";
import * as express from "express";
import { parallel } from "mesh";
import { HTTP_SERVER_STARTED, HTTPServerStartedEvent, HTTPServerState } from "../http";
import { 
  ImmutableObject, 
  logDebugAction, 
  Dispatcher, 
  routeTypes, 
  StoreChangedEvent,
  whenStoreChanged,
} from "aerial-common2";

export type FrontEndState = {
  frontEnd: {
    entryPath: string
  }
} & HTTPServerState;

export const initFrontEndService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {

  const addFrontEndRoutes = ({ payload: { frontEnd, http: { expressServer } } }: StoreChangedEvent<FrontEndState>) => {
    const frontEndEntryBasename = path.basename(frontEnd.entryPath);

    expressServer.all("/index.html", (req, res) => {
      res.send(`
        <html>
          <head>
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