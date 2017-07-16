
import { initBaseApplication, ConsoleLogConfig } from "aerial-common2";
import { initHTTPServer, HTTPConfig } from "./http";
import { initFrontEndService, FrontEndConfig } from "./front-end";

export type BackEndConfig = HTTPConfig & FrontEndConfig & ConsoleLogConfig;

export const initApplication = (config: BackEndConfig) => (
  initBaseApplication(config)
    .then(initHTTPServer(config).run)
    .then(initFrontEndService(config).run)
);