import { reader } from "../monad";
import { ImmutableObject } from "../immutable";
import { createLogger, Logger, logInfoAction, initConsoleLogService, ConsoleLogContext } from "../log";

export type BaseApplicationConfig = { };
export type BaseApplicationContext = ImmutableObject<{
  log: Logger
}> & ConsoleLogContext;

export const initBaseApplication = (config: BaseApplicationConfig) => (
  initConsoleLogService(config).bind((context: BaseApplicationContext) => {
    const log = createLogger(context.dispatch);
    log((logInfoAction(`config: ${JSON.stringify(config, null, 2)}`)));
    return context.set("log", log);
  })
)
