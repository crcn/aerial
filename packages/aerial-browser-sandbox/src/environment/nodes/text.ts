import { weakMemo } from "aerial-common2";
import { getSEnvNodeClass, SEnvNodeInterface } from "./node";
import { SEnvNodeTypes } from "../constants";

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
    
    data: string;
    readonly length: number;
    readonly wholeText: string;
    readonly assignedSlot: HTMLSlotElement | null;
    splitText(offset: number): Text {
      return null;
    }
    remove() { }
    appendData(arg: string): void { }
    deleteData(offset: number, count: number): void { }
    insertData(offset: number, arg: string): void { }
    replaceData(offset: number, count: number, arg: string): void { }
    substringData(offset: number, count: number): string {
      return null;
    }
  }
});