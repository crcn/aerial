import { reader } from "../monad";
import { parallel, circular } from "mesh";
import { flowRight } from "lodash";
import { ImmutableObject } from "../immutable";
import { initStoreService } from "../store";
import { createStore, Reducer, Store, applyMiddleware } from "redux";
import { SagaIterator, default as createSagaMiddleware } from "redux-saga";
import { fork } from "redux-saga/effects";
import { createAction, Dispatcher, whenType } from "../bus";
import { 
  logger,
  logInfoAction, 
  consoleLogSaga,
  ConsoleLogState,
  consoleLogDispatcher, 
} from "../log";

export type BaseApplicationState = ConsoleLogState;

export const LOAD_APP = "LOAD_APP";
export const loadAppAction = () => createAction(LOAD_APP);

export type ChildBootstrapper = (upsteam: Dispatcher<any>) => (downstream: Dispatcher<any>) => Dispatcher<any>;

// DEPRECATED
export const initBaseApplication = <TState>(initialState: BaseApplicationState, reducer: Reducer<TState>, child: ChildBootstrapper) => circular((upstream: Dispatcher<any>) => flowRight(
  initStoreService(initialState, reducer, upstream),
  consoleLogDispatcher,
  (downstream: Dispatcher<any>) => parallel(whenType(LOAD_APP, () => {
    logger(upstream)(logInfoAction(`initial state: ${JSON.stringify(initialState, null, 2)}`));
  }), downstream),
  child(upstream)
));

export const initBaseApplication2 = <TState>(initialState: TState, reducer: Reducer<TState>, mainSaga: () => Iterator<any>) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducer, 
    initialState,
    applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(function*() {
    yield fork(consoleLogSaga);
    yield fork(mainSaga);
  });
};
