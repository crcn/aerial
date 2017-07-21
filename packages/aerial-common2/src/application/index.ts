import { reader } from "../monad";
import { parallel } from "mesh";
import { flowRight } from "lodash";
import { ImmutableObject } from "../immutable";
import { initStoreService } from "../store";
import { createStore, Reducer, Store } from "redux";
import { createAction, loopedDispatcher, Dispatcher, whenType } from "../bus";
import { 
  logger, 
  logInfoAction, 
  ConsoleLogConfig,
  ConsoleLogContext, 
  consoleLogDispatcher, 
} from "../log";

export type BaseApplicationConfig = ConsoleLogConfig;

export const LOAD_APP = "LOAD_APP";
export const loadAppAction = () => createAction(LOAD_APP);

export type ChildBootstrapper<T extends BaseApplicationConfig> = (config: BaseApplicationConfig, upsteam: Dispatcher<any>) => (downstream: Dispatcher<any>) => Dispatcher<any>;

export const initBaseApplication = <TState>(config: BaseApplicationConfig, initialState: TState, reducer: Reducer<TState>, child: ChildBootstrapper<any>) => loopedDispatcher((upstream) => flowRight(
  consoleLogDispatcher(config),
  initStoreService(initialState, reducer, upstream),
  (downstream: Dispatcher<any>) => parallel(whenType(LOAD_APP, () => {
    logger(upstream)(logInfoAction(`config: ${JSON.stringify(config, null, 2)}`));
  }), downstream),
  child(config, upstream)
));
