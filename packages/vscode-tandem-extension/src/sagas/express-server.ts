import * as express from "express";
import * as getPort from "get-port";
import * as http from "http";
import { ExtensionState } from "../state";
import * as multiparty from "connect-multiparty";
import { eventChannel } from "redux-saga";
import { httpRequest, VISUAL_DEV_CONFIG_LOADED } from "../actions";
import { select, fork, spawn, take, put, call } from "redux-saga/effects";

export function* expresssServerSaga() {
  yield fork(handleVisualDevConfigLoaded);
  
}

function* handleVisualDevConfigLoaded() {
  let server: express.Express;
  let httpServer: http.Server;

  while(true) {
    yield take(VISUAL_DEV_CONFIG_LOADED);

    if (httpServer) {
      httpServer.close();
    }

    const { visualDevConfig: { port } }: ExtensionState = yield select();

    server = express();
    
    // start taking requests and dispatching them to other sagas
    yield fork(function*() {
      const chan = eventChannel((emit) => {
        server.use((req, res) => {
          emit(httpRequest(req, res));
        });
        return () => {
  
        };
      });
  
      while(true) {
        yield put(yield take(chan));
      }
    });
  
    // TODO - dispatch express server initialized
    httpServer = server.listen(port);
    console.log(`HTTP server listening on port ${port}`);  
  }
}