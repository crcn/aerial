import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";
import { getSEnvNodeClass, SEnvNodeInterface, diffValueNode } from "./node";

export interface SEnvCommentInterface extends SEnvNodeInterface, Comment {

}

export const getSEnvCommentClass = weakMemo((window: Window) => {
  const SEnvNode = getSEnvNodeClass(window);
  return class SEnvComment extends SEnvNode implements Comment {
    data: string;
    readonly length: number;
    readonly nodeType: number =  SEnvNodeTypes.COMMENT;
    constructor(public nodeValue: string) {
      super();
      this.data = nodeValue;
    }

    get text() {
      return this.nodeValue;
    }

    cloneShallow() {
      const clone = this.ownerDocument.createComment(this.nodeValue);
      return clone;
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

export const diffComment = (oldComment: Comment, newComment: Comment) => {
  return diffValueNode(oldComment, newComment);
};
