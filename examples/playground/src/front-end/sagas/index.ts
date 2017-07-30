import { delay } from "redux-saga";
import { Kernel } from "aerial-common";
import { createQueue } from "mesh";
import { shortcutsService } from "./shortcuts";
import { mainWorkspaceSaga } from "./workspace";
import { fork, call, select } from "redux-saga/effects";
import { mainSyntheticBrowserSaga } from "aerial-synthetic-browser";
import { readUriAction, watchUriAction } from "aerial-sandbox2";
import { createLegacyLocalProtocolAdapter } from "./local-protocol";
import { Dispatcher, diffArray, eachArrayValueMutation } from "aerial-common2";

export function* mainSaga() {

  const { saga: uriProtocolSaga, provider } = createLegacyLocalProtocolAdapter();
  
  yield fork(mainWorkspaceSaga);
  yield fork(mainSyntheticBrowserSaga(new Kernel(
    provider
  )));
  yield fork(uriProtocolSaga);
  yield fork(shortcutsService);
}
