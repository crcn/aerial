import * as http from "http";
import * as express from "express";
import { reader, ImmutableObject, Reader } from "aerial-common2";

export type HTTPContext = ImmutableObject<{
  httpServer: http.Server,
  expressServer: express.Express,
}>;

export type HTTPConfig = {
  http: {
    port: number
  }
}

export const initHTTPServer = (config: HTTPConfig) => {
  const expressServer = express();
  const httpServer    = expressServer.listen(config.http.port);
  return reader((context: ImmutableObject<any>): HTTPContext => context.set("expressServer", expressServer).set("httpServer", httpServer));
};


