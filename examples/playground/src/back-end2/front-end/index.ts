import * as http from "http";
import * as express from "express";
import * as path from "path";
import { readAll } from "mesh";
import { BackendConfig } from "../application";
import { Dispatcher, Message, weakMemo, logDebugAction, log, underchange, reader } from "aerial-common2";

import { HTTPConfig, getHTTPServer, HTTPServerProvider } from "../http";

export type FrontEndConfig = {
  frontEnd: {
    entryPath: string
  }
};

export type FrontEndProvider = {
  http
}

const addListeners = weakMemo((config: BackendConfig, _getHTTPServer: typeof getHTTPServer) => underchange(async (upstream) => {
  log(logDebugAction(`adding front-end handlers`), upstream);
  const frontEndEntryBasename = path.basename(config.frontEnd.entryPath);

  const { expressServer } = _getHTTPServer(config);

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
  
}));

export const startFrontEndService = (config: BackendConfig) => reader((provider) => {

})

export const frontEndDispatcher = (config: BackendConfig, _getHTTPServer: typeof getHTTPServer, upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {
  addListeners(config, _getHTTPServer)(upstream);
  return downstream;
};