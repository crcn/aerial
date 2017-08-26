import { BaseApplicationState, createStructFactory } from "aerial-common2";

export const APPLICATION_STATE = "APPLICATION_STATE";

export type RouterRootState = {
  router?: {
    location: string
  }
}

export type ApplicationState = {
  element: HTMLElement;
} & BaseApplicationState & RouterRootState;


export const createApplicationState = createStructFactory<ApplicationState>(APPLICATION_STATE, {
  router: {
    location: location.hash
  }
});