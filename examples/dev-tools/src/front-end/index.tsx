import "./scss/index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { circular, parallel } from "mesh";
import { flowRight } from "lodash";
import { Main } from "./components";
import { mainReducer } from "./reducers";
import { createApplicationState, ApplicationState } from "./state";
import { mainSaga } from "./sagas";
import * as io from 'socket.io-client';
import { isPublicAction } from "common";
import createSocketIoMiddleware from "redux-socket.io";
import { Provider } from "react-redux";
import { 
  hook,
  fork,
  workerReducer,
  ImmutableObject,
  initBaseApplication2, 
  BaseApplicationState,
} from "aerial-common2";

export const initApplication = (initialState: ApplicationState) => {
  const store = initBaseApplication2(
    initialState, 
    mainReducer, 
    mainSaga,
    createSocketIoMiddleware(io(`${location.protocol}//${initialState.apiHost}`), isPublicAction)
  );

  ReactDOM.render(<Provider store={store}>
    <Main dispatch={action => store.dispatch(action)} />
  </Provider>, initialState.element);
  return store;
}
