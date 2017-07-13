import { BackendConfig } from "../application";
import { Dispatcher } from "aerial-common2";

export const frontEndDispatcher = (config: BackendConfig) => (downstreamDispatch: Dispatcher<any>) => {
  return downstreamDispatch;
};