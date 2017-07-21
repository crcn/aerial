import { noop, flowRight } from "lodash";
import { initHTTPServer, HTTPConfig } from "./http";
import { initFrontEndService, FrontEndConfig } from "./front-end";
import { initBaseApplication, ConsoleLogConfig, Dispatcher } from "aerial-common2";

export type BackEndConfig = HTTPConfig & FrontEndConfig & ConsoleLogConfig;

export const initApplication = <T>(config: BackEndConfig, initialState?: T) => (
  initBaseApplication(config, null, noop, (config: BackEndConfig, upstream: Dispatcher<any>) => flowRight(
    initHTTPServer(config, upstream),
    initFrontEndService(config, upstream)
  ))
);
