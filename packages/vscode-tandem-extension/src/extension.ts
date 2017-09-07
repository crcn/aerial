import vscode = require("vscode");
import { mainSaga } from "./sagas";
import { mainReducer } from "./reducers";
import createSagaMiddleware from "redux-saga";
import {extensionActivated } from "./actions";
import { createStore, applyMiddleware } from "redux";

export async function activate(context: vscode.ExtensionContext) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    mainReducer,
    {
      rootPath: vscode.workspace.rootPath,
      fileCache: {}
    },
    applyMiddleware(sagaMiddleware)
  );
  
  sagaMiddleware.run(mainSaga);
  store.dispatch(extensionActivated());
}
