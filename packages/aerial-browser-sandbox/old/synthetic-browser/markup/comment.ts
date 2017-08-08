import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { serializable, ITreeWalker } from "aerial-common";
import { SyntheticDOMNodeSerializer } from "./node";
import { SyntheticDOMValueNode, SyntheticDOMValueNodeSerializer, SyntheticDOMValueNodeEdit } from "./value-node";

export class SyntheticDOMComment extends SyntheticDOMValueNode {
  readonly nodeType: number = DOMNodeType.COMMENT;

  constructor(nodeValue: string) {
    super("#comment", nodeValue);
  }

  toString() {
    return `<!--${this.nodeValue}-->`;
  }

  get textContent() {
    return "";
  }

  set textContent(value: string) {
    this.nodeValue = value;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitComment(this);
  }

  protected cloneShallow() {
    return new SyntheticDOMComment(this.nodeValue);
  }

  visitWalker(walker: ITreeWalker) { }
}