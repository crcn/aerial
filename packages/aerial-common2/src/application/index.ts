import { reader } from "../monad";
import { createAction } from "../bus";
import { ImmutableObject } from "../immutable";
import { createLogger, Logger, logInfoAction, initConsoleLogService, ConsoleLogContext, ConsoleLogConfig } from "../log";

export type BaseApplicationConfig = ConsoleLogConfig;
export type BaseApplicationContext = ImmutableObject<{
  log: Logger
} & ConsoleLogContext>;

export const LOAD_APP = "LOAD_APP";
export const loadAppAction = () => createAction(LOAD_APP);

export const initBaseApplication = (config: BaseApplicationConfig) => (
  initConsoleLogService(config).bind((context: BaseApplicationContext) => {
    context.log((logInfoAction(`config: ${JSON.stringify(config, null, 2)}`)));
    return context;
  })
)
