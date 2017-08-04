import { delay } from "redux-saga";
import { Kernel } from "aerial-common";
import { createQueue } from "mesh";
import { shortcutsService } from "./shortcuts";
import { mainWorkspaceSaga } from "./workspace";
import { fork, call, select } from "redux-saga/effects";
import { syntheticBrowserSaga } from "aerial-browser-sandbox";
import { Dispatcher, diffArray, eachArrayValueMutation } from "aerial-common2";
import { createLegacyLocalProtocolAdapter, createLegacyURLProtocolAdapter } from "./protocol";

export function* mainSaga() {

  const { saga: localProtocolSaga, provider: localProtocolProvider } = createLegacyLocalProtocolAdapter();
  const { saga: urlProtocolSaga, provider: urlProtocolProvider } = createLegacyURLProtocolAdapter();

  yield fork(syntheticBrowserSaga);
  yield fork(mainWorkspaceSaga);
  yield fork(localProtocolSaga);
  yield fork(urlProtocolSaga);
  yield fork(shortcutsService);
}
