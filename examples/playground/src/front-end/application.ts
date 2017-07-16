import { MainComponent } from "./components";
import { initReactService } from "./react";
import { initBackEndService } from "./back-end";
import { initBaseApplication, BaseApplicationConfig } from "aerial-common2";

export type FrontEndConfig = {
  element: HTMLElement
} & BaseApplicationConfig;

export const initApplication = (config: FrontEndConfig) => (
  initBaseApplication(config)
    .bind(initBackEndService(config).run)
    .bind(initReactService({
      element: config.element,
      mainComponentClass: MainComponent,
    }).run)
)