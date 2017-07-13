import { Dispatcher, createMessage } from "../bus";

export const APP_INITIALIZED = "APP_INITIALIZED";
export const APP_READY       = "APP_READY";

export const appInitialized = () => createMessage(APP_INITIALIZED);
export const appReady       = () => createMessage(APP_READY);

// nothing for now
export const bootstrapper = <T>(fn: (options: T) => Dispatcher<any>) => (options: T) => fn(options);