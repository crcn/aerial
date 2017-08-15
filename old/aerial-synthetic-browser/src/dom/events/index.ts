import { IMessage, IBus } from "mesh7";
import { CoreEvent, Observable, serializable } from "aerial-common";
import { SyntheticDOMNode } from "../markup";

export class SyntheticDOMEvent<T> extends CoreEvent {
  readonly target: T;
  constructor(readonly type: string) {
    super(type);
  }

  preventDefault() {
    // TODO
  }
}

// http://www.w3schools.com/jsref/dom_obj_event.asp
@serializable("SyntheticMouseEvent", {
  serialize({ type }: SyntheticMouseEvent<any>) {
    return [type];
  },
  deserialize([type]) {
    return new SyntheticMouseEvent<any>(type);
  }
})
export class SyntheticMouseEvent<T> extends SyntheticDOMEvent<T> {
  static readonly CLICK       = "click";
  static readonly dblclick    = "dblclick";
  static readonly MOUSE_DOWN  = "mouseDown";
  static readonly MOUSE_ENTER = "mouseEnter";
  static readonly MOUSE_LEAVE = "mouseLeave";
  static readonly MOUSE_MOVE  = "mouseMove";
  static readonly MOUSE_OVER  = "mouseOver";
  static readonly MOUSE_OUT   = "mouseOut";
  static readonly MOUSE_UP    = "mouseUp";
}


// for testing in chrome console -- remove this eventually
global["SyntheticMouseEvent"] = SyntheticMouseEvent;

@serializable("SyntheticKeyboardEvent", {
  serialize({ type }: SyntheticKeyboardEvent<any>) {
    return [type];
  },
  deserialize([type]) {
    return new SyntheticKeyboardEvent<any>(type);
  }
})
export class SyntheticKeyboardEvent<T> extends SyntheticDOMEvent<T> {
  static readonly KEY_DOWN  = "keyDown";
  static readonly KEY_PRESS = "keyPress";
  static readonly KEY_UP    = "keyUp";
}

export namespace DOMEventTypes {

  /**
   * Fired when all nodes have been added to the Document object -- different from LOAD
   * since DOM_CONTENT_LOADED doesn't wait for other assets such as stylesheet loads.
   */

  export const DOM_CONTENT_LOADED = "DOMContentLoaded";

  /**
   * Fired after all assets and DOM content has loaded
   */

  export const LOAD = "load";

  /**
   * Fired when a location object property changes
   */

  export const POP_STATE = "popState";
}

export type DOMEventListenerFunction = <T extends SyntheticDOMNode>(event: SyntheticDOMEvent<T>) => boolean|void;

export class DOMEventDispatcher implements IBus<SyntheticDOMEvent<any>, void> {
  constructor(readonly type: string, readonly listener: DOMEventListenerFunction) { }

  dispatch(event: SyntheticDOMEvent<any>) {

    // TODO - check bool return value from event listener
    if (event.type === this.type) {
      this.listener(event);
    }
  }
}

export interface IDOMEventEmitter {
  addEventListener(type: string, listener: DOMEventListenerFunction, capture?: boolean);
  removeEventListener(type: string, listener: DOMEventListenerFunction, capture?: boolean);
}

// TODO - implement capture bool check
export class DOMEventDispatcherMap {
  private _map: Map<string, DOMEventDispatcher[]>
  
  constructor(readonly target: Observable) {
    this._map = new Map();
  }

  add(type: string, listener: DOMEventListenerFunction, capture?: boolean) {
    const observer = new DOMEventDispatcher(type, listener);

    if (!this._map.has(type)) {
      this._map.set(type, []);
    }

    this._map.get(type).push(observer);
    this.target.observe(observer);
  }

  remove(type: string, listener: DOMEventListenerFunction, capture?: boolean) {
    const observers = this._map.get(type) || [];
    for (let i = observers.length; i--;) {
      const observer = observers[i];
      if (observer.listener === listener) {
        observers.splice(i, 1);
        this.target.unobserve(observer);
        break;
      }
    } 
  }
}