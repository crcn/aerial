import { weakMemo } from "aerial-common2";
import { getSEnvNodeClass } from "./node";
import { SEnvNodeTypes } from "../constants";

export const getSEnvCommentClass = weakMemo((window: Window) => {
  const SEnvNode = getSEnvNodeClass(window);
  return class SEnvComment extends SEnvNode implements Comment {
    data: string;
    readonly length: number;
    readonly nodeType: number =  SEnvNodeTypes.COMMENT;
    constructor(readonly text: string) {
      super();
    }
    remove() {
      
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