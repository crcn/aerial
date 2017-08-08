import { weakMemo } from "aerial-common2";
import { getSEnvEventClasses } from "../events";

export const getL3EventClasses = weakMemo((context: any) => {
  const { SEnvEvent } = getSEnvEventClasses(context);
  class SEnvMutationEvent extends SEnvEvent implements MutationEvent {

    // public is fine here since MutationEvent interface is used -- these
    // props are typically readonly
    public attrChange: number;
    public attrName: string;
    public newValue: string;
    public prevValue: string;
    public relatedNode: Node;

    readonly ADDITION: number;
    readonly MODIFICATION: number;
    readonly REMOVAL: number;

    initMutationEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, relatedNodeArg: Node, prevValueArg: string, newValueArg: string, attrNameArg: string, attrChangeArg: number): void {
      super.initEvent(typeArg, canBubbleArg, cancelableArg);
      this.relatedNode = relatedNodeArg;
      this.prevValue = prevValueArg;
      this.newValue = newValueArg;
      this.attrName = attrNameArg;
      this.attrChange = attrChangeArg;
    }
    
  }

  return {
    SEnvMutationEvent
  }
});