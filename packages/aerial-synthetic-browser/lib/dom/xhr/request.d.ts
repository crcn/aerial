import { Observable } from "aerial-common";
import { IStreamableBus } from "mesh";
import { HTTPStatusType } from "./messages";
import { IDOMEventEmitter, DOMEventListenerFunction } from "../events";
export declare enum XMLHttpRequestReadyState {
    UNSET = 0,
    OPENED = 1,
    HEADERS_RECEIVED = 2,
    LOADING = 3,
    DONE = 4,
}
export declare class SyntheticXMLHttpRequest extends Observable implements IDOMEventEmitter {
    readonly bus: IStreamableBus<any>;
    private _method;
    private _url;
    private _async;
    private _overrideMimeType;
    private _domListenerMap;
    private _responseData;
    private _readyState;
    private _status;
    private _response;
    private _output;
    onreadystatechange: Function;
    onload: Function;
    constructor(bus: IStreamableBus<any>);
    readonly readyState: XMLHttpRequestReadyState;
    readonly status: HTTPStatusType;
    readonly responseType: string;
    readonly responseText: string;
    addEventListener(type: string, listener: DOMEventListenerFunction): void;
    removeEventListener(type: string, listener: DOMEventListenerFunction): void;
    overrideMimeType(type: string): void;
    open(method: string, url: string, async?: boolean): void;
    send(data?: any): Promise<void>;
    private setReadyState(state);
    abort(): void;
    private _asyncSend(data);
}
