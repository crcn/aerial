import "./scss/index.scss";

const reduceReducers = require("reduce-reducers");
import { flowRight } from "lodash";
import { MainComponent } from "./components";
import { applicationReducer } from "./reducers";
import { initMainService, mainServiceReducer } from "./services";
import { createApplicationState, ApplicationState } from "./state";
import { 
  Dispatcher,
  StoreContext,
  ImmutableObject,
  initStoreService,
  initBaseApplication, 
  BaseApplicationState,
} from "aerial-common2";

const mainReducer = reduceReducers(
  applicationReducer,
  mainServiceReducer
);

export const initApplication = (initialState: ImmutableObject<ApplicationState>) => initBaseApplication(initialState.set("mainComponentClass", MainComponent), mainReducer, initMainService);