import { weakMemo } from "aerial-common2";

export interface EventTargetInterface extends Event {
  $target: EventTarget;
  $currentTarget: EventTarget;
}

export const getSEnvEventClasses = weakMemo((window: Window) => {
  class SEnvEvent implements EventTargetInterface {

    $target: any;
    $currentTarget: any;

    private _type: string;
    private _bubbles: boolean;
    private _cancelable: boolean;

    cancelBubble: boolean;
    readonly defaultPrevented: boolean;
    readonly eventPhase: number;
    readonly isTrusted: boolean;
    returnValue: boolean;
    readonly srcElement: Element | null;
    readonly timeStamp: number;
    readonly scoped: boolean;
    initEvent(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean): void {
      this._type = eventTypeArg;
      this._bubbles = canBubbleArg;
      this._cancelable = cancelableArg;
    }

    get target() {
      return this.$target;
    }

    get currentTarget() {
      return this.$currentTarget;
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