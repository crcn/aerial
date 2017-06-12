import { IObservable, watchProperty, waitForPropertyChange } from "@tandem/common/observable";

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { waitForPropertyChange };