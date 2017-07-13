import { Action, createAction } from "../bus";

export enum LogLevel {
   DEBUG   = 1       << 1,
   INFO    = DEBUG   << 1,
   WARNING = INFO    << 1,
   ERROR   = WARNING << 1,
   LOG     = ERROR   << 1,

   NONE    = 0,
   DEFAULT = INFO | WARNING | ERROR,
   ALL     = DEBUG | INFO | WARNING | ERROR | LOG,
   VERBOSE = ALL,
}

export type LogAction = {
  level: LogLevel,
  text: string,
  type: LogActionTypes
} & Action;

export enum LogActionTypes {
  LOG = "log"
}

export const log = (level: LogLevel, text: string): LogAction => createAction(LogActionTypes.LOG, {
  level,
  text
}) as LogAction;

export const logDebug    = (text: string) => log(LogLevel.DEBUG, text);
export const logInfo     = (text: string) => log(LogLevel.INFO, text);
export const logWarning  = (text: string) => log(LogLevel.WARNING, text);
export const logError    = (text: string) => log(LogLevel.ERROR, text);