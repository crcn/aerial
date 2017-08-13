import { delay } from "redux-saga";
import { createQueue } from "mesh";
const blobToBuffer = require("blob-to-buffer");
import { call, fork, select } from "redux-saga/effects";
import { ApplicationState } from "front-end/state";
import { URIProtocol, IURIProtocolReadResult, URIProtocolProvider } from "aerial-sandbox";
import { createURIProtocolSaga, fileCacheSaga } from "aerial-sandbox2";


// copy / pasta code since it's throw away. This will be removed once the synthetic browser
// uses sagas & reducers. (CC)


export function* createUrlProxyProtocolSaga() {
  const apiHost = yield select((state: ApplicationState) => state.apiHost);

  const adapterBase = {
    async read(uri: string): Promise<IURIProtocolReadResult> {
      const res = await fetch(`${window.location.protocol}//${apiHost}/proxy/${encodeURIComponent(uri)}`);
      let contentType = res.headers.get("content-type");
      if (contentType) contentType = contentType.split(";").shift();
      const blob = await res.blob();

      return new Promise<IURIProtocolReadResult>((resolve, reject) => {
        blobToBuffer(blob, (err, buffer) => {
          if (err) return reject(err);
          resolve({
            type: contentType,
            content: buffer
          })
        })
      });
    },
    write(uri: string, content) {
      return null;
    },
    watch(uri: string, content) {
      return () => {};
    },
    delete(uri: string) {
      return null;
    }
  };

  return function*() {
    yield fork(fileCacheSaga);
    yield fork(createURIProtocolSaga({
      name: "http",
      ...adapterBase
    }));

    yield fork(createURIProtocolSaga({
      name: "https",
      ...adapterBase
    }));
  }
}