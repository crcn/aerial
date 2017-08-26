import { BaseApplicationState, createStructFactory } from "aerial-common2";

export const APPLICATION_STATE = "APPLICATION_STATE";

export type ApplicationState = {
  element: HTMLElement;
} & BaseApplicationState;


export const createApplicationState = createStructFactory<ApplicationState>(APPLICATION_STATE, {

});