import { delay } from "redux-saga";
import { createQueue } from "mesh";
const blobToBuffer = require("blob-to-buffer");
import { call, fork, select } from "redux-saga/effects";
import { ApplicationState, getAllFilesByPath } from "front-end/state";
import { URIProtocol, IURIProtocolReadResult, URIProtocolProvider } from "aerial-sandbox";

const getAllFilesWithLocalProtocol = (state: ApplicationState) => getAllFilesByPath(state, "local://");

// copy / pasta code since it's throw away. This will be removed once the synthetic browser
// uses sagas & reducers. (CC)

export function createLegacyLocalProtocolAdapter () {

  const _read = createQueue<any>();
  const watchers = {};

  const clazz = class extends URIProtocol {
    read(uri: string): Promise<IURIProtocolReadResult> {
      return new Promise((resolve) => {
        _read.unshift([(result) => {
          resolve(result);
        }, uri]);
      });
    }
    write(uri: string, content: any, options?: any): Promise<any> {
      return Promise.resolve();
    }
    fileExists(uri: string): Promise<boolean> {
      return Promise.resolve(true);
    }
    watch2(uri: string, onChange: () => any) {
      let previous;
      watchers[uri] = (filesByUrl) => {
        if (previous && filesByUrl[uri] !== previous) {
          onChange();
        }
        previous = filesByUrl[uri];
      };
      return {
        dispose() {
          delete watchers[uri];
        }
      };
    }
  };

  return {
    provider: new URIProtocolProvider("local", clazz),
    saga: function*() {

      yield fork(function *read() {
        while(true) {
          const [resolve, url] = yield call(() => {
            return _read.next().then(({ value }) => value);
          });

          const allFilesByUrl = yield select(getAllFilesWithLocalProtocol);
          console.log(allFilesByUrl, url);
          resolve(allFilesByUrl[url]);
        }
      });

      yield fork(function *watch() {
        while(true) {
          const allFilesByUrl = yield select(getAllFilesWithLocalProtocol);
          for (const uri in watchers) {
            watchers[uri](allFilesByUrl);
          }
          yield call(delay, 100);
        }
      });
    }
  }
};


export function createLegacyURLProtocolAdapter () {

  const _read = createQueue<any>();
  const watchers = {};

  const clazz = class extends URIProtocol {
    read(uri: string): Promise<IURIProtocolReadResult> {
      return new Promise((resolve) => {
        _read.unshift([(result) => {
          resolve(result);
        }, uri]);
      });
    }
    write(uri: string, content: any, options?: any): Promise<any> {
      return Promise.resolve();
    }
    fileExists(uri: string): Promise<boolean> {
      return Promise.resolve(true);
    }
    watch2(uri: string, onChange: () => any) {
      let previous;
      watchers[uri] = (filesByUrl) => {
        if (previous && filesByUrl[uri] !== previous) {
          onChange();
        }
        previous = filesByUrl[uri];
      };
      return {
        dispose() {
          delete watchers[uri];
        }
      };
    }
  };

  return {
    provider: [new URIProtocolProvider("http", clazz), new URIProtocolProvider("https", clazz)],
    saga: function*() {

      yield fork(function *read() {
        while(true) {
          const [resolve, url] = yield call(() => {
            return _read.next().then(({ value }) => value);
          });

          const apiHost = yield select((state: ApplicationState) => state.apiHost);

          resolve(yield call(async () => {
            const res = await fetch(`${window.location.protocol}//${apiHost}/proxy/${encodeURIComponent(url)}`);
            res.headers
            let contentType = res.headers.get("content-type");
            if (contentType) contentType = contentType.split(";").shift();
            const blob = await res.blob();

            return await new Promise((resolve, reject) => {
              blobToBuffer(blob, (err, buffer) => {
                if (err) return reject(err);
                resolve({
                  type: contentType,
                  content: buffer
                })
              })
            });
          }));
        }
      });

      yield fork(function *watch() {
        while(true) {
          const allFilesByUrl = yield select(getAllFilesWithLocalProtocol);
          for (const uri in watchers) {
            watchers[uri](allFilesByUrl);
          }
          yield call(delay, 100);
        }
      });
    }
  }
};
