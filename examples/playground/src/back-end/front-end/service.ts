import * as path from "path";
import * as express from "express";
import { HTTPContext } from "../http";
import { reader, ImmutableObject, ConsoleLogContext, logDebugAction } from "aerial-common2";

export type FrontEndConfig = {
  frontEnd: {
    entryPath: string
  }
};

export type FrontEndContext = ImmutableObject<{
  
} & HTTPContext & ConsoleLogContext>;

export const initFrontEndService = (config: FrontEndConfig) => reader((context: FrontEndContext) => {
  const { log, expressServer } = context;

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

  return context;
});