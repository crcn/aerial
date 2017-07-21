import { reader, ImmutableObject, ConsoleLogContext, ConsoleLogContextIdentity, logDebugAction } from "aerial-common2";

export type BackEndServiceContextIdentity = ConsoleLogContextIdentity;


export const initBackEndService = (config: any) => reader(<TContext extends BackEndServiceContextIdentity>(context: TContext) => {
  return context;
});