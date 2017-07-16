
import { initBaseApplication } from "aerial-common2";
import { initHTTPServer, HTTPConfig } from "./http";
import { initFrontEndService, FrontEndConfig } from "./front-end";

export type BackEndConfig = {

} & HTTPConfig & FrontEndConfig;

export const initApplication = (config: BackEndConfig) => (
  initBaseApplication(config)
    .bind(initHTTPServer(config).run)
    .bind(initFrontEndService(config).run)
);