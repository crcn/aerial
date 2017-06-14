import { IBus } from "mesh";
import { CoreEvent, Observable } from "aerial-common";
import { SyntheticDOMNode } from "../markup";
export declare class SyntheticDOMEvent<T> extends CoreEvent {
    readonly type: string;
    readonly target: T;
    constructor(type: string);
    preventDefault(): void;
}
export declare class SyntheticMouseEvent<T> extends SyntheticDOMEvent<T> {
    static readonly CLICK: string;
    static readonly dblclick: string;
    static readonly MOUSE_DOWN: string;
    static readonly MOUSE_ENTER: string;
    static readonly MOUSE_LEAVE: string;
    static readonly MOUSE_MOVE: string;
    static readonly MOUSE_OVER: string;
    static readonly MOUSE_OUT: string;
    static readonly MOUSE_UP: string;
}
export declare class SyntheticKeyboardEvent<T> extends SyntheticDOMEvent<T> {
    static readonly KEY_DOWN: string;
    static readonly KEY_PRESS: string;
    static readonly KEY_UP: string;
}
export declare namespace DOMEventTypes {
    /**
     * Fired when all nodes have been added to the Document object -- different from LOAD
     * since DOM_CONTENT_LOADED doesn't wait for other assets such as stylesheet loads.
     */
    const DOM_CONTENT_LOADED = "DOMContentLoaded";
    /**
     * Fired after all assets and DOM content has loaded
     */
    const LOAD = "load";
    /**
     * Fired when a location object property changes
     */
    const POP_STATE = "popState";
}
export declare type DOMEventListenerFunction = <T extends SyntheticDOMNode>(event: SyntheticDOMEvent<T>) => boolean | void;
export declare class DOMEventDispatcher implements IBus<SyntheticDOMEvent<any>, void> {
    readonly type: string;
    readonly listener: DOMEventListenerFunction;
    constructor(type: string, listener: DOMEventListenerFunction);
    dispatch(event: SyntheticDOMEvent<any>): void;
}
export interface IDOMEventEmitter {
    addEventListener(type: string, listener: DOMEventListenerFunction, capture?: boolean): any;
    removeEventListener(type: string, listener: DOMEventListenerFunction, capture?: boolean): any;
}
export declare class DOMEventDispatcherMap {
    readonly target: Observable;
    private _map;
    constructor(target: Observable);
    add(type: string, listener: DOMEventListenerFunction, capture?: boolean): void;
    remove(type: string, listener: DOMEventListenerFunction, capture?: boolean): void;
}
