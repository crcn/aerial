import { IObservable, watchProperty, waitForPropertyChange } from "../observable";

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { waitForPropertyChange };