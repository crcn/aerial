import { reader, ImmutableObject, Dispatcher, logDebugAction } from "aerial-common2";

export const initBackEndService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => downstream;