import "./scss/index.scss";

import { flowRight } from "lodash";
import { MainComponent } from "./components";
import { initBackEndService } from "./back-end";
import { applicationReducer } from "./reducers";
import { createApplicationState, ApplicationState } from "./state";
import { initReactService, ReactServiceState } from "./react";
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
    initBackEndService(upstream),
    initReactService(upstream)
  ))
);