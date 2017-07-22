import "./scss/index.scss";

import { flowRight } from "lodash";
import { MainComponent } from "./components";
import { initBackEndService } from "./back-end";
import { initMainDispatcher } from "./dispatchers";
import { applicationReducer } from "./reducers";
import { initReactService, ReactServiceState } from "./react";
import { createApplicationState, ApplicationState } from "./state";
import { 
  Dispatcher,
  StoreContext,
  ImmutableObject,
  initStoreService,
  initBaseApplication, 
  BaseApplicationState,
} from "aerial-common2";

export const initApplication = (initialState: ImmutableObject<ApplicationState>) => (
  initBaseApplication(initialState.set("mainComponentClass", MainComponent), applicationReducer, (upstream: Dispatcher<any>) => flowRight(
    initMainDispatcher(upstream),
    initBackEndService(upstream),
    initReactService(upstream)
  ))
);