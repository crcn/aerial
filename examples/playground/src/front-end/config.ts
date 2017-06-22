import {ILogServiceConfig} from "aerial-common";

export interface IFrontEndConfig extends ILogServiceConfig {
  element: HTMLElement;
}