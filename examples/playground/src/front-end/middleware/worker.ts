import { Store, MiddlewareAPI, Dispatch } from "redux";

export const createWorkerMiddleware = () => (store: MiddlewareAPI<any>) => {
  return (next: Dispatch<any>) => action => {
    return next(action);
  }
};