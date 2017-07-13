import { 
  HTTPService,
  FrontEndService, 
} from "./services";

// TODO - pair dispatcher with state mutator

import { RootState } from "./state";
import { frontEndDispatcher } from "./front-end";
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
  },
  frontEnd: {
    entryPath: string
  }
} & ConsoleLogConfig;

export const bootstrapBackend = bootstrapper((config: BackendConfig, state: RootState, upstreamDispatch: Dispatcher<any>, downstreamDispatch: Dispatcher<any> = noop) => 
  flowRight(
    frontEndDispatcher(config, upstreamDispatch),
    consoleLogger(config),
    ((downstreamDispatch: Dispatcher<any>) => sequence(
      async (m) => new Promise(resolve => setTimeout(resolve, 100)),
      (m) => {
        return log(logDebugAction(`state: ${JSON.stringify(state)}`), upstreamDispatch);
      },
      downstreamDispatch
    ))
  )(downstreamDispatch)
);

// export const bootstrapBackend = bootstrapper((options: BackendOptions) => store(options.state, reduce, (state, dispatch) => sequence(
//   async (message) => {
//     return new Promise((resolve) => setTimeout(resolve, 100));
//   },
//   (message) => {
//     console.log(state);
//     if (state.progress === APP_READY) {
//       if (state.count) {
//         return dispatch(createMessage(DECREMENT));
//       }
//     }
//   },
//   // httpDispatcher(),
//   // frontEndDispatcher(),
//   // consoleDispatcher(),
//   !state.progress ? (() => dispatch(appInitialized())) : state.progress === APP_INITIALIZED ? (() => dispatch(appReady())) : (() => {}),
// )));
// export class BackEndApplication extends ServiceApplication {
//   protected registerProviders() {
//     super.registerProviders();
//     this.kernel.register(

//       // core
//       new KernelProvider(),

//       // services
//       new ApplicationServiceProvider(HTTPService.name, HTTPService),
//       new ApplicationServiceProvider(FrontEndService.name, FrontEndService),
//       new ApplicationServiceProvider(ConsoleLogService.name, ConsoleLogService),
//     );
//   }
// }