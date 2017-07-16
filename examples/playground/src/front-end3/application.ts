import { sequence } from "mesh";
import { flowRight } from "lodash";
import { RootState } from "./state";
import { reactDispatcher } from "./react";
import { RootComponent } from "./components";
import { bootstrapper, ApplicationState, ImmutableObject, Dispatcher, log, logDebugAction } from "aerial-common2";

export type FrontendConfig = {
  
};

export const bootstrapFrontend = () => bootstrapper((config: FrontendConfig, state: RootState, upstream: Dispatcher<any>) => flowRight(
  reactDispatcher(state, RootComponent),
  (downstream) => sequence((m) => {
    log(logDebugAction("test"), upstream);
  }, downstream)
));