import { 
  HTTPService,
  FrontEndService, 
} from "./services";

// TODO - pair dispatcher with state mutator

import { RootState } from "./state";
import { getHTTPServer } from "./http";
import { frontEndDispatcher, FrontEndConfig } from "./front-end";
import { noop, curryRight, flowRight } from "lodash";
import { sequence, parallel, when, limit, awaitable } from "mesh";
import { 
  store,
  Message, 
  log,
  whenType,
  whenNotType,
  Dispatcher,
  bootstrapper, 
  consoleLogger,
  createMessage,
  logDebugAction,
  ConsoleLogConfig,
} from "aerial-common2";

export type BackendConfig = {
  http: {
    port: number
  }
} & ConsoleLogConfig & FrontEndConfig;

export const bootstrapBackend = (_getHTTPServer: typeof getHTTPServer = getHTTPServer) => bootstrapper((config: BackendConfig, state: RootState, upstream: Dispatcher<any>) => 
  flowRight(

    // sets up hooks for the front-end server ti interact with the backend. Note that hooks are
    // dispatched as events to the reducer which may modify the application state
    frontEndDispatcher(config, _getHTTPServer, upstream),

    ((downstream: Dispatcher<any>) => sequence(
      async (m) => new Promise(resolve => setTimeout(resolve, 100)),
      (m) => {
        return log(logDebugAction(`state: ${JSON.stringify(state)}`), upstream);
      },
      downstream
    ))
  )
);

