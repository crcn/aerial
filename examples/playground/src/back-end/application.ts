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
  bootstrapper, 
  appInitialized, 
  APP_INITIALIZED, 
} from "aerial-common2";

export type BackendOptions = {
  state: RootState;
};

const reduce = (state: RootState, message: Message) => {
  switch(message.type) {
    case APP_READY: return state.set('progress', APP_READY);
    case APP_INITIALIZED: return state.set('progress', APP_INITIALIZED);
  }
  return state;
}

export const bootstrapBackend = bootstrapper((options: BackendOptions) => store(options.state, reduce, (state, dispatch) => parallel(
  (message: Message) => {
    options.state = reduce(options.state, message);
  },
  when(() => !options.state.progress, () => dispatch(appInitialized())),
  when(() => options.state.progress === APP_INITIALIZED, () => dispatch(appReady())),
  () => {
    console.log('app loaded: ', options.state.progress);
  }
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