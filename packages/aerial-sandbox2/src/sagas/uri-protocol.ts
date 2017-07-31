import { fork } from "redux-saga/effects";
import { URIProtocolReadResult } from "../state";

export type URIProtocolAdapter = {
  read(uri: string): Promise<URIProtocolReadResult>;
}

export const createURIProtocolSaga = (adapter: URIProtocolAdapter) => {
  return function*() {
    yield fork(handleReadRequest, adapter);
    yield fork(handleWriteRequest, adapter);
    yield fork(handleWatchRequest, adapter);
    yield fork(handleDeleteRequest, adapter);
  }
}

function* handleReadRequest(adapter: URIProtocolAdapter) {
  
}

function* handleWriteRequest(adapter: URIProtocolAdapter) {

}

function* handleWatchRequest(adapter: URIProtocolAdapter) {

}

function* handleDeleteRequest(adapter: URIProtocolAdapter) {

}


