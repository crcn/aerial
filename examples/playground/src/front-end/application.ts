import "./scss/index.scss";

const reduceReducers = require("reduce-reducers");
import { circular, parallel } from "mesh";
import { flowRight } from "lodash";
import { MainComponent } from "./components";
import { applicationReducer } from "./reducers";
import { initMainService, mainServiceReducer } from "./services";
import { createApplicationState, ApplicationState } from "./state";
import { 
  hook,
  fork,
  whenMaster,
  Dispatcher,
  StoreContext,
  workerReducer,
  ImmutableObject,
  initStoreService,
  whenPublicMessage,
  initBaseApplication, 
  BaseApplicationState,
} from "aerial-common2";

const mainReducer = reduceReducers(
  workerReducer,
  applicationReducer,
  mainServiceReducer
);

export const initApplication = (initialState: ApplicationState) => circular((upstream: Dispatcher<any>) => flowRight(
    initBaseApplication({ ...initialState, mainComponentClass: MainComponent } as ApplicationState, mainReducer, initMainService),
    (downstream: Dispatcher<any>) => parallel(downstream, whenPublicMessage(whenMaster(upstream, fork(upstream), hook(upstream))))
));