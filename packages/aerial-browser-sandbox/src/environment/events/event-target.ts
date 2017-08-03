import { weakMemo } from "aerial-common2";

export const getSEnvEventTargetClass = weakMemo((context: any) => {
  return class SEnvEventTarget implements EventTarget {
    addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {

    }

    dispatchEvent(event: Event): boolean {
      return false;
    }

    removeEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
      
    }
  }
});