import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";
import { getSEnvNodeClass, SEnvNodeInterface, diffValueNode } from "./node";

export interface SEnvTextInterface extends SEnvNodeInterface, Text {

}

export const getSEnvTextClass = weakMemo((context: any) => {
  const SEnvNode = getSEnvNodeClass(context);
  return class SEnvText extends SEnvNode implements Text {
    readonly nodeType: number =  SEnvNodeTypes.TEXT;
    constructor(public nodeValue: string) {
      super();
    }

    get textContent() {
      return this.nodeValue;
    }

    set textContent(value: string) {
      this.nodeValue = value;
    }

    cloneShallow() {
      return this.ownerDocument.createTextNode(this.nodeValue);
    }
    
    data: string;
    readonly length: number;
    readonly wholeText: string;
    readonly assignedSlot: HTMLSlotElement | null;
    splitText(offset: number): Text {
      return null;
    }

    appendData(arg: string): void { }
    deleteData(offset: number, count: number): void { }
    insertData(offset: number, arg: string): void { }
    replaceData(offset: number, count: number, arg: string): void { }
    substringData(offset: number, count: number): string {
      return null;
    }
  }
});

export const diffTextNode = (oldNode: Text, newNode: Text) => {
  return diffValueNode(oldNode, newNode);
}