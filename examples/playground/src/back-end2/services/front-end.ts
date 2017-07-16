import {BaseBackEndService} from "./base";
import {HTTPServerLoadedEvent} from "../messages";
import {IBackEndApplicationConfig} from "../config";
import * as express from "express";
import * as path from "path";
import {
  loggable, 
  CoreApplicationService,
  LoadApplicationRequest,
  InitializeApplicationRequest
} from "aerial-common";

@loggable()
export class FrontEndService extends BaseBackEndService {
  [HTTPServerLoadedEvent.HTTP_SERVER_LOADED]({expressServer}: HTTPServerLoadedEvent) {

    const frontEndEntryBasename = path.basename(this.config.frontEnd.entryPath);

    // TODO - move this to global handler
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
      express.static(path.dirname(this.config.frontEnd.entryPath))
    );
  } 
}