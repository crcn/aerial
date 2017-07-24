import { reader } from "../monad";
import { parallel, circular } from "mesh";
import { flowRight } from "lodash";
import { ImmutableObject } from "../immutable";
import { initStoreService } from "../store";
import { createStore, Reducer, Store } from "redux";
import { createAction, Dispatcher, whenType } from "../bus";
import { 
  logger,
  logInfoAction, 
  ConsoleLogState,
  consoleLogDispatcher, 
} from "../log";

export type BaseApplicationState = ConsoleLogState;

export const LOAD_APP = "LOAD_APP";
export const loadAppAction = () => createAction(LOAD_APP);

export type ChildBootstrapper = (upsteam: Dispatcher<any>) => (downstream: Dispatcher<any>) => Dispatcher<any>;

export const initBaseApplication = <TState>(initialState: BaseApplicationState, reducer: Reducer<TState>, child: ChildBootstrapper) => circular((upstream) => flowRight(
  initStoreService(initialState, reducer, upstream),
  consoleLogDispatcher,
  (downstream: Dispatcher<any>) => parallel(whenType(LOAD_APP, () => {
    logger(upstream)(logInfoAction(`initial state: ${JSON.stringify(initialState, null, 2)}`));
  }), downstream),
  child(upstream)
));
