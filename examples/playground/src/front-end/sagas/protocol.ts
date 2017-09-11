import { delay } from "redux-saga";
import { createQueue } from "mesh";
const blobToBuffer = require("blob-to-buffer");
import { call, fork, select } from "redux-saga/effects";
import { ApplicationState } from "front-end/state";
import { getAPIProxyUrl } from "../utils";
import { createURIProtocolSaga, fileCacheSaga } from "aerial-sandbox2";

// copy / pasta code since it's throw away. This will be removed once the synthetic browser
// uses sagas & reducers. (CC)


export function* createUrlProxyProtocolSaga() {
  const state: ApplicationState = yield select();

  const adapterBase = {
    async read(uri: string): Promise<any> {
      const res = await fetch(uri);
      let contentType = res.headers.get("content-type");
      if (contentType) contentType = contentType.split(";").shift();
      const blob = await res.blob();

      return new Promise<any>((resolve, reject) => {
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