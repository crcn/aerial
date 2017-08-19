import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";
import { getSEnvNodeClass, SEnvNodeInterface, diffValueNode, getSEnvValueNode } from "./node";
import { SYNTHETIC_COMMENT, SyntheticComment, BasicComment } from "../../state";

export interface SEnvCommentInterface extends SEnvNodeInterface, Comment {

}

export const getSEnvCommentClass = weakMemo((context) => {
  const SEnvValueNode = getSEnvValueNode(context);
  return class SEnvComment extends SEnvValueNode implements Comment {
    readonly length: number;
    readonly nodeType: number =  SEnvNodeTypes.COMMENT;
    readonly structType: string = SYNTHETIC_COMMENT;
    readonly nodeName: string = "#comment";
    
    get data() {
      return this.nodeValue;
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

export const diffComment = (oldComment: BasicComment, newComment: BasicComment) => {
  return diffValueNode(oldComment, newComment);
};
