import { CoreEvent } from "aerial-common";
import { Server } from "http";
import * as express from "express";

export class HTTPServerLoadedEvent extends CoreEvent {
  static readonly HTTP_SERVER_LOADED = "httpServerLoaded";
  constructor(readonly expressServer: express.Express, readonly httpServer: Server) {
    super(HTTPServerLoadedEvent.HTTP_SERVER_LOADED);
  }
}