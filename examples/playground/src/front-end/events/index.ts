import { readAll } from "mesh";
import { createEvent, Dispatcher } from "aerial-common2"

export enum DOMEventType {
  DOCUMENT_READY = "DOCUMENT_READY"
}

export const documentReadyEvent = () => createEvent(DOMEventType.DOCUMENT_READY);
export const documentReady = (dispatch: Dispatcher<any>) => readAll(dispatch(documentReadyEvent()));