import { weakMemo, createPropertyMutation } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";
import { SYNTHETIC_TEXT_NODE, SyntheticTextNode, BasicValueNode, BasicTextNode } from "../../state";
import { getSEnvNodeClass, SEnvNodeInterface, diffValueNode, UPDATE_VALUE_NODE, getSEnvValueNode } from "./node";

export interface SEnvTextInterface extends SEnvNodeInterface, Text {

}

export const getSEnvTextClass = weakMemo((context: any) => {
  const SEnvValueNode = getSEnvValueNode(context);

  return class SEnvText extends SEnvValueNode implements Text {
    readonly nodeType: number =  SEnvNodeTypes.TEXT;
    readonly structType: string = SYNTHETIC_TEXT_NODE;
    readonly nodeName: string = "#text";
    
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

export const diffTextNode = (oldNode: BasicTextNode, newNode: BasicTextNode) => {
  return diffValueNode(oldNode, newNode);
}