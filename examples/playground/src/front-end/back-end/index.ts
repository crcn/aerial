import { reader, ImmutableObject, ConsoleLogContext, logDebugAction } from "aerial-common2";

export type BackEndServiceContext = ImmutableObject<{
  
}> & ConsoleLogContext;

export const initBackEndService = (config: any) => reader((context: BackEndServiceContext) => {
  context.log(logDebugAction(`test`));
  return context;
});