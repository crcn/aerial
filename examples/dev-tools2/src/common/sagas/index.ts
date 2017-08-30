import * as io from "socket.io";
import { fork, take, spawn } from "redux-saga/effects";
import { } from "redux";
import { bubbleEventChannel } from "../utils";
import { isPublicAction } from "../actions";

type SIOSocket = {
  emit(event: string, data: any);
  on(event: string, listener: Function);
}

export const createSocketIOSaga = (socket: SIOSocket) => {
  return function*() {
    yield fork(function*() {
      while(true) {
        const action = yield take(isPublicAction);
        socket.emit("action", action);
      }
    });

    yield bubbleEventChannel((emit) => {
      socket.on("action", emit);
      return () => {};
    })
  }
}