import * as express from "express";

import { BaseBackEndService } from "./base";
import { HTTPServerLoadedEvent } from "../messages";
import { LoadApplicationRequest, loggable } from "aerial-common";

// TODO - dispatch incomming HTTP requests globally

@loggable()
export class HTTPService extends BaseBackEndService {

  private _server: express.Express;

  [LoadApplicationRequest.LOAD]() {
    this._server = express();

    const {port} = this.config.http;

    this.bus.dispatch(new HTTPServerLoadedEvent(
      this._server,
      this._server.listen(port)
    ));
    
    this.logger.info(`HTTP server listening on port *${port}*`);
  }
}