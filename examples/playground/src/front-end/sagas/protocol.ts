import { delay } from "redux-saga";
import { createQueue } from "mesh";
const blobToBuffer = require("blob-to-buffer");
import { call, fork, select } from "redux-saga/effects";
import { ApplicationState } from "front-end/state";
import { getAPIProxyUrl } from "../utils";
import { createURIProtocolSaga, fileCacheSaga } from "aerial-sandbox2";

// copy / pasta code since it's throw away. This will be removed once the synthetic browser
// uses sagas & reducers. (CC)

const RETRY_COUNT = 3;
const RETRY_TIMEOUT = 1000 * 2;

export function* createUrlProxyProtocolSaga() {
  const state: ApplicationState = yield select();
  const { proxy } = state;

  const adapterBase = {
    async read(uri: string): Promise<any> {

      if (proxy) {
        uri = `${proxy}${encodeURIComponent(uri)}`;
      }

      let retries = RETRY_COUNT;

      let res: Response;

      // cover cases where fetch fails in text editor extension -- probably
      // because the dev server hasn't started yet.
      while(retries) {
        res = await fetch(uri);
        if (res.status === 500) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, RETRY_TIMEOUT));
        } else {
          break;
        }
      }

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