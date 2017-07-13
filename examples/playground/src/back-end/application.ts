import { 
  HTTPService,
  FrontEndService, 
} from "./services";

// TODO - pair dispatcher with state mutator

import { RootState } from "./state";
import { sequence, parallel, when, limit, awaitable } from "mesh";
import { 
  store,
  Message, 
  appReady, 
  APP_READY,
  createMessage,
  bootstrapper, 
  appInitialized, 
  APP_INITIALIZED, 
} from "aerial-common2";

export type BackendOptions = {
  state: RootState;
};

const DECREMENT = "DECREMENT";

const reduce = (state: RootState, message: Message) => {
  switch(message.type) {
    case DECREMENT: return state.set("count", state.count - 1);
    case APP_READY: return state.set('progress', APP_READY);
    case APP_INITIALIZED: return state.set('progress', APP_INITIALIZED);
  }
  return state;
}

export const bootstrapBackend = bootstrapper((options: BackendOptions) => store(options.state, reduce, (state, dispatch) => sequence(
  async (message) => {
    return new Promise((resolve) => setTimeout(resolve, 100));
  },
  (message) => {
    console.log(state);
    if (state.progress === APP_READY) {
      if (state.count) {
        return dispatch(createMessage(DECREMENT));
      }
    }
  },
  // httpDispatcher(),
  // frontEndDispatcher(),
  // consoleDispatcher(),
  !state.progress ? (() => dispatch(appInitialized())) : state.progress === APP_INITIALIZED ? (() => dispatch(appReady())) : (() => {}),
)));
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