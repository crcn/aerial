import * as path from "path";
import * as express from "express";
import { parallel } from "mesh";
import { HTTP_SERVER_STARTED, HTTPServerStartedEvent } from "../http";
import { reader, ImmutableObject, ConsoleLogContext, logDebugAction, Dispatcher, routeTypes } from "aerial-common2";

export type FrontEndConfig = {
  frontEnd: {
    entryPath: string
  }
};

export const initFrontEndService = (config: FrontEndConfig, upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {
  const onHTTPServerStarted = ({ expressServer }: HTTPServerStartedEvent) => {
    const frontEndEntryBasename = path.basename(config.frontEnd.entryPath);

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
      express.static(path.dirname(config.frontEnd.entryPath))
    );
  };

  return parallel(routeTypes({
    [HTTP_SERVER_STARTED]: onHTTPServerStarted
  }), downstream);
};