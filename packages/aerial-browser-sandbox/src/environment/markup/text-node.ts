import { DOMNodeType } from "./node-types";
import { BaseContentEdit } from "aerial-sandbox";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDOMNodeSerializer } from "./node";
import { serializable, serialize, deserialize, ISerializable, ISerializer, ITreeWalker } from "aerial-common";
import { SyntheticDOMValueNode, SyntheticDOMValueNodeSerializer, SyntheticDOMValueNodeEdit } from "./value-node";


@serializable("SyntheticDOMText", new SyntheticDOMNodeSerializer(new SyntheticDOMValueNodeSerializer()))
export class SyntheticDOMText extends SyntheticDOMValueNode {
  readonly nodeType: number = DOMNodeType.TEXT;
  constructor(nodeValue: string) {
    super("#text", nodeValue);
  }

  get textContent(): string {
    return this.nodeValue;
  }

  set textContent(value: string) {
    this.nodeValue = value;
  }

  toString() {
    return this.nodeValue;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitText(this);
  }

  protected cloneShallow() {
    return new SyntheticDOMText(this.nodeValue);
  }

  visitWalker(walker: ITreeWalker) { }
}