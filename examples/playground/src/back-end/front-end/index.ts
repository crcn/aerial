import * as http from "http";
import { readAll } from "mesh";
import { BackendConfig } from "../application";
import { Dispatcher, Message, weakMemo, logDebugAction, log, underchange } from "aerial-common2";

import { HTTPConfig, getHTTPServer } from "../http";

const addListeners = weakMemo((config: HTTPConfig) => underchange(async (upstream) => {
  const server = getHTTPServer(config);
  log(logDebugAction(`adding front-end handlers`), upstream);
})) as (config: HTTPConfig) => (dispatcher: Dispatcher<any>) => any;

export const frontEndDispatcher = (config: BackendConfig, upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {
  addListeners(config)(upstream);
  return downstream;
};