import { inject } from "../decorators";
import { Logger } from "../logger";
import { noopBusInstance } from "mesh7";
import { PrivateBusProvider } from "../ioc";


// TODO - use a singleton here? It might be okay
export function loggable () {
  return (clazz: any) => {

    const loggerBusProperty = "$$loggerBus";

    // this assumes the object is being injected -- it may not be.
    inject(PrivateBusProvider.ID)(clazz.prototype, loggerBusProperty);

    Object.defineProperty(clazz.prototype, "logger", {
      get() {
        if (this.$$logger) return this.$$logger;

        const bus = this[loggerBusProperty];

        // create a child logger so that the prefix here does
        // not get overwritten
        return this.$$logger = (new Logger(
          bus || noopBusInstance,
          `${this.constructor.name}: `
        ).createChild());
      }
    });
  };
}

// export function logCall() {

// }
