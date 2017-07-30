import "./scss/index.scss";

const reduceReducers = require("reduce-reducers");
import * as React from "react";
import * as ReactDOM from "react-dom";
import { circular, parallel } from "mesh";
import { flowRight } from "lodash";
import { MainComponent } from "./components";
import { applicationReducer } from "./reducers";
import { createApplicationState, ApplicationState } from "./state";
import { mainSaga } from "./sagas";
import { Provider } from "react-redux";
import { 
  hook,
  fork,
  workerReducer,
  ImmutableObject,
  initBaseApplication2, 
  BaseApplicationState,
} from "aerial-common2";

const mainReducer = reduceReducers(
  workerReducer,
  applicationReducer
);

export const initApplication = (initialState: ApplicationState) => {
  const store = initBaseApplication2(initialState, mainReducer, mainSaga);
  ReactDOM.render(<Provider store={store}>
    <MainComponent dispatch={action => store.dispatch(action)} />
  </Provider>, initialState.element);
}
