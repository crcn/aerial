import 'reflect-metadata';
import {BaseSyntheticBrowser} from "./browser";
import { RemoteBrowserService } from "./remote-browser";
import { Kernel, ApplicationServiceProvider } from "aerial-common";

export function createSyntheticBrowserWorkerProviders() {
  return [
    new ApplicationServiceProvider("remoteBrowserRenderer", RemoteBrowserService)
  ];
}

export * from "./dom";
export * from "./browser";
export * from "./renderers";
export * from "./providers";
export * from "./sandbox";
export * from "./location";
export * from "./messages";
export * from "./remote-browser";

