import { readAll } from "mesh";
import { Action, createAction, Dispatcher } from "../bus";

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

export const logAction = (level: LogLevel, text: string): LogAction => createAction(LogActionTypes.LOG, {
  level,
  text
}) as LogAction;

export type Logger = (action: LogAction) => any;

export const createLogger = (dispatch: Dispatcher<any>): Logger => (action: LogAction) => readAll(dispatch(action));

export const logDebugAction    = (text: string) => logAction(LogLevel.DEBUG, text);
export const logInfoAction     = (text: string) => logAction(LogLevel.INFO, text);
export const logWarningAction  = (text: string) => logAction(LogLevel.WARNING, text);
export const logErrorAction    = (text: string) => logAction(LogLevel.ERROR, text);