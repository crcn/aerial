import { weakMemo, Mutation } from "aerial-common2";
import { SEnvWindowInterface } from "../window";

export interface EventTargetInterface extends Event {
  $target: EventTarget;
  $currentTarget: EventTarget;
}

export interface SEnvMutationEventInterface extends Event {
  readonly mutation: Mutation<any>;
}

export interface SEnvWindowOpenedEventInterface extends Event {
  readonly window: SEnvWindowInterface;
}

export const getSEnvEventClasses = weakMemo((context: any = {}) => {
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

  class SEnvMutationEvent extends SEnvEvent {
    static readonly MUTATION = "MUTATION";
    public mutation: Mutation<any>;
    initMutationEvent(mutation: Mutation<any>) {
      this.mutation = mutation;
      super.initEvent(SEnvMutationEvent.MUTATION, true, true);
    }
  }

  class SEnvWindowOpenedEvent extends SEnvEvent {
    static readonly WINDOW_OPENED = "WINDOW_OPENED";
    public window: SEnvWindowInterface;
    initWindowOpenedEvent(window: SEnvWindowInterface) {
      super.initEvent(SEnvWindowOpenedEvent.WINDOW_OPENED, true, true);
      this.window = window;
    }
  }

  class SEnvURIChangedEvent extends SEnvEvent {
    static readonly URI_CHANGED = "URI_CHANGED";
    constructor(readonly uri: string) {
      super();
      this.initEvent(SEnvURIChangedEvent.URI_CHANGED, true, true);
    }
  }

  return {
    SEnvEvent,
    SEnvURIChangedEvent,
    SEnvMutationEvent,
    SEnvWindowOpenedEvent
  };
});