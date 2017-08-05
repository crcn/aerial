import { weakMemo } from "aerial-common2";
import { EventTargetAddon } from "./event";


const callEventListener = (listener: EventListenerOrEventListenerObject, event: Event) => (
  typeof listener === "function" ? listener(event) : listener.handleEvent(event)
);

export const getSEnvEventTargetClass = weakMemo((context?: any) => {
  return class SEnvEventTarget implements EventTarget {
    private _eventListeners: {
      [identifier: string]: EventListenerOrEventListenerObject | EventListenerOrEventListenerObject[]
    }

    private _preconstructed: boolean;

    constructor() {
      if (!this._preconstructed) {
        this.$$preconstruct();
      }
    }

    $$preconstruct() {
      this._preconstructed = true;
      this._eventListeners = {};
    }

    addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      if (!this._eventListeners[type]) {
        this._eventListeners[type] = listener;
      } else if (!Array.isArray(this._eventListeners[type])) {
        this._eventListeners[type] = [this._eventListeners[type] as EventListenerOrEventListenerObject, listener];
      } else {
        (this._eventListeners[type] as EventListenerOrEventListenerObject[]).push(listener);
      }
    }

    dispatchEvent(event: Event): boolean {
      const eva = event as EventTargetAddon;
      eva.$currentTarget = this;
      if (!eva.$target) {
        eva.$target = this;
      }
      const listeners = this._eventListeners[event.type];
      if (!listeners) return false;
      if (Array.isArray(listeners)) {
        for (const listener of listeners) {

          // -- TODO -- check for stopImmediatePropagation
          callEventListener(listener, event);
        }
      } else {
        callEventListener(listeners, event);
      }
      return true;
    }

    removeEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
      const listeners = this._eventListeners[event.type];
      if (!listeners) return;
      if (listeners === listener) {
        this._eventListeners[event.type] = undefined;
      } else if (Array.isArray(listeners)) {
        const index = listeners.indexOf(listener);
        (listeners as EventListenerOrEventListenerObject[]).splice(index, 1);
        if (listeners.length === 1) {
          this._eventListeners[event.type] = listeners[0];
        }
      }
    }
  }
});