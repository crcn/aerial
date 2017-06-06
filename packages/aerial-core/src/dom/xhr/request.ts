import { Observable, bindable } from "@tandem/common";
import { bindDOMEventMethods } from "../utils";
import { IStreamableDispatcher, IMessage, WritableStream, ReadableStream } from "@tandem/mesh";
import { HTTPRequest, HTTPResponse, IHTTPHeaders, HTTPStatusType } from "./messages";

import {
  IDOMEventEmitter, 
  SyntheticDOMEvent,
  DOMEventDispatcher, 
  DOMEventDispatcherMap, 
  DOMEventListenerFunction, 
} from "../events";
  
export enum XMLHttpRequestReadyState {
  UNSET = 0,
  OPENED = 1,
  HEADERS_RECEIVED = 2,
  LOADING = 3,
  DONE = 4
}

// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
export class SyntheticXMLHttpRequest extends Observable implements IDOMEventEmitter {

  private _method: string;
  private _url: string;
  private _async: boolean;
  private _overrideMimeType: string;
  private _domListenerMap: DOMEventDispatcherMap;
  private _responseData: any[];

  private _readyState: XMLHttpRequestReadyState;
  private _status: number;
  private _response: HTTPResponse;
  private _output: WritableStream<any>;

  @bindable()
  public onreadystatechange: Function;
  public onload: Function;

  constructor(readonly bus: IStreamableDispatcher<any>) {
    super();
    this.setReadyState(XMLHttpRequestReadyState.UNSET);
    this._domListenerMap = new DOMEventDispatcherMap(this);
    bindDOMEventMethods(["readyStateChange"], this);
  }

  get readyState() {
    return this._readyState;
  }

  get status() {
    return this._response && this._response.status;
  }

  get responseType() {
    return this._response && this._response.headers.contentType;
  }

  get responseText() {
    return this._responseData.join("");
  }

  addEventListener(type: string, listener: DOMEventListenerFunction) {
    this._domListenerMap.add(type, listener);
  }

  removeEventListener(type: string, listener: DOMEventListenerFunction) {
    this._domListenerMap.remove(type, listener);
  }

  overrideMimeType(type: string) {
    this._overrideMimeType = type;
  }
  
  open(method: string, url: string, async?: boolean) {
    this.setReadyState(XMLHttpRequestReadyState.OPENED);
    this._method = method;
    this._url = url;
    this._async = async;
  }

  async send(data?: any) {
    await this._asyncSend(data);
  }

  private setReadyState(state: XMLHttpRequestReadyState) {
    this._readyState = state;
    this.notify(new SyntheticDOMEvent("readyStateChange"));
  }

  abort() {
    if (this._output && this.readyState !== XMLHttpRequestReadyState.DONE) {
      this._output.abort("no reason");
    }
  }

  private async _asyncSend(data: any) {

    return new Promise((resolve, reject) => {
      this.setReadyState(XMLHttpRequestReadyState.LOADING);
      const headers: IHTTPHeaders = {};
      const request = new HTTPRequest(this._method, this._url, headers);
      const duplex = this.bus.dispatch(request);
      
      const responseData = [];

      this._output = duplex.writable;

      duplex.readable.pipeTo(new WritableStream({
        write: (chunk) => {
          if (chunk && (<IMessage>chunk).type === HTTPResponse.HTTP_RESPONSE) {
            const response = this._response = <HTTPResponse>chunk;
            this.setReadyState(XMLHttpRequestReadyState.HEADERS_RECEIVED);
          } else {
            responseData.push(chunk);
          }
          // first response must be a header here - TODO
        },
        close: () => {
          this._responseData = responseData;
          this.setReadyState(XMLHttpRequestReadyState.DONE);
          resolve();
        },
        abort: (reason) => {

        }
      }));
    });
  }
}