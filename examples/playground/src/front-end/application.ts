import "./scss/index.scss";

import { MainComponent } from "./components";
import { initReactService } from "./react";
import { initBackEndService } from "./back-end";
import { applicationReducer } from "./reducers";
import { createApplicationState } from "./state";
import { 
  StoreContext,
  initStoreService,
  initBaseApplication, 
  BaseApplicationConfig,
} from "aerial-common2";

export type FrontEndConfig = {
  element: HTMLElement
} & BaseApplicationConfig;

export const initApplication = (config: FrontEndConfig) => (
  initBaseApplication(config)
    .then(initStoreService(createApplicationState(), applicationReducer).run)
    .then(initBackEndService(config).run)
    .then(initReactService({
      element: config.element,
      mainComponentClass: MainComponent,
    }).run)
)