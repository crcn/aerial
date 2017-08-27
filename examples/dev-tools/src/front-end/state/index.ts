import { BaseApplicationState, createStructFactory, Bounds } from "aerial-common2";


export const APPLICATION_STATE = "APPLICATION_STATE";

export enum MainPageType {
  INDEX = "INDEX",
  PREVIEW = "PREVIEW"
};

export type ChildWindow = {
  location: string;
  bounds: Bounds;
};

export type RouterApplicationState = {
  router?: {
    location: string
  }
};

export type IndexPageRootState = {
  indexPage?: {
    childWindows: ChildWindow[];
  }
}

export type PreviewPageState = {
  
};

export type ApplicationState = {
  apiHost: string;
  element: HTMLElement;
  mainPage?: MainPageType;
} & BaseApplicationState & RouterApplicationState & IndexPageRootState;

export const createApplicationState = createStructFactory<ApplicationState>(APPLICATION_STATE, {
  router: {
    location: location.hash
  }
});