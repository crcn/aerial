import { weakMemo } from "aerial-common2";

export const getEventClasses = weakMemo((window: Window) => {
  class SEnvEvent implements Event {

    private _type: string;
    private _bubbles: boolean;
    private _cancelable: boolean;

    cancelBubble: boolean;
    readonly currentTarget: EventTarget;
    readonly defaultPrevented: boolean;
    readonly eventPhase: number;
    readonly isTrusted: boolean;
    returnValue: boolean;
    readonly srcElement: Element | null;
    readonly target: EventTarget;
    readonly timeStamp: number;
    readonly scoped: boolean;
    initEvent(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean): void {
      this._type = eventTypeArg;
      this._bubbles = canBubbleArg;
      this._cancelable = cancelableArg;
    }

    get type() {
      return this._type;
    }
    get bubbles() {
      return this._bubbles;
    }
    get cancelable() {
      return this._cancelable;
    }
    preventDefault(): void {

    }
    stopImmediatePropagation(): void {

    }
    stopPropagation(): void {

    }
    deepPath(): EventTarget[] {
      return []
    };
    readonly AT_TARGET: number;
    readonly BUBBLING_PHASE: number;
    readonly CAPTURING_PHASE: number;
  }

  return {
    SEnvEvent
  }
});