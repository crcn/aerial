import { mainSaga } from "./sagas";
import { mainReducer } from "./reducers";
import { noop, flowRight } from "lodash";
import { ApplicationState } from "./state";
import * as express from "express";
import { applyMiddleware } from "redux";
import createSocketIoMiddleware from "redux-socket.io";
import * as io from "socket.io";
import { isPublicAction  } from "../common";
import { initBaseApplication2, ConsoleLogState, BaseApplicationState } from "aerial-common2";


export const initApplication = (initialState?: ApplicationState) => {

  const inst = express();
  const httpServer = inst.listen(initialState.http.port);

  const ioServer = io(httpServer);

  return initBaseApplication2(
    initialState, 
    mainReducer, 
    mainSaga(inst),
    createSocketIoMiddleware(ioServer, isPublicAction)
  );
}

