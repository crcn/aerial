import { weakMemo } from "aerial-common2";
import { getEventClasses } from "../events";

export const getL3EventClasses = weakMemo((window: Window) => {
  const { SEnvEvent } = getEventClasses(window);
  class SEnvMutationEvent extends SEnvEvent implements MutationEvent {
    readonly attrChange: number;
    readonly attrName: string;
    readonly newValue: string;
    readonly prevValue: string;
    readonly relatedNode: Node;
    initMutationEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, relatedNodeArg: Node, prevValueArg: string, newValueArg: string, attrNameArg: string, attrChangeArg: number): void {
      super.initEvent(typeArg, canBubbleArg, cancelableArg);
    }
    readonly ADDITION: number;
    readonly MODIFICATION: number;
    readonly REMOVAL: number;

    constructor(type: string, eventInitDict?: EventInit) {
      super();
    }
  }

  return {
    SEnvMutationEvent
  }
});