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
  isMaster,
  Dispatcher,
  StoreContext,
  ImmutableObject,
  initStoreService,
  whenPublicMessage,
  initBaseApplication, 
  BaseApplicationState,
} from "aerial-common2";

const mainReducer = reduceReducers(
  applicationReducer,
  mainServiceReducer
);

export const initApplication = (initialState: ImmutableObject<ApplicationState>) => circular((upstream: Dispatcher<any>) => flowRight(
    initBaseApplication(initialState.set("mainComponentClass", MainComponent), mainReducer, initMainService),
    (downstream: Dispatcher<any>) => parallel(downstream, whenPublicMessage(isMaster ? fork(upstream) : hook(upstream)))
));