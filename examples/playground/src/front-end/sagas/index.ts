import { delay } from "redux-saga";
import { Kernel } from "aerial-common";
import { createQueue } from "mesh";
import { shortcutsService } from "./shortcuts";
import { mainWorkspaceSaga } from "./workspace";
import { fork, call, select } from "redux-saga/effects";
import { mainSyntheticBrowserSaga } from "aerial-synthetic-browser";
import { readUriAction, watchUriAction } from "aerial-sandbox2";
import { Dispatcher, diffArray, eachArrayValueMutation } from "aerial-common2";
import { createLegacyLocalProtocolAdapter, createLegacyURLProtocolAdapter } from "./protocol";

export function* mainSaga() {

  const { saga: localProtocolSaga, provider: localProtocolProvider } = createLegacyLocalProtocolAdapter();
  const { saga: urlProtocolSaga, provider: urlProtocolProvider } = createLegacyURLProtocolAdapter();
  
  yield fork(mainWorkspaceSaga);
  yield fork(mainSyntheticBrowserSaga(new Kernel(
    localProtocolProvider,
    urlProtocolProvider
  )));
  yield fork(localProtocolSaga);
  yield fork(urlProtocolSaga);
  yield fork(shortcutsService);
}
