import { bindable } from "@tandem/common";
import { decode } from "ent";
import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { SyntheticDOMNode, SyntheticDOMNodeEdit } from "./node";
import { ISerializer, Mutation, SetValueMutation, PropertyMutation  } from "@tandem/common";
import { BaseContentEdit, SyntheticObjectChangeTypes, BaseEditor, GroupEditor } from "@tandem/sandbox";

export namespace SyntheticDOMValueNodeMutationTypes {
  export const SET_VALUE_NODE_EDIT = "setValueNodeEdit";
}

export class SyntheticDOMValueNodeEdit extends SyntheticDOMNodeEdit<SyntheticDOMValueNode> {

  setValueNode(nodeValue: string) {
    return this.addChange(new SetValueMutation(SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT, this.target, nodeValue));
  }

  addDiff(newValueNode: SyntheticDOMValueNode) {
    if (this.target.nodeValue !== newValueNode.nodeValue) {
      this.setValueNode(newValueNode.nodeValue);
    }
    return super.addDiff(newValueNode);
  }
}

export class DOMValueNodeEditor<T extends SyntheticDOMValueNode|Text|Comment> extends BaseEditor<T> {
  applySingleMutation(mutation: Mutation<T>) {
    if (mutation.type === SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT) {
        this.target.nodeValue = decode((<SetValueMutation<any>>mutation).newValue);
    }
  }
}

export function isDOMValueNodeMutation(mutation: Mutation<SyntheticDOMValueNode>) {
  return (mutation.target.nodeType === DOMNodeType.COMMENT || mutation.target.nodeType === DOMNodeType.TEXT) && (!!{
    [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT]: true
  }[mutation.type]);
}

export class SyntheticDOMValueNodeSerializer implements ISerializer<SyntheticDOMValueNode, string> {
  serialize({ nodeValue }: SyntheticDOMValueNode) {
    return nodeValue;
  }
  deserialize(nodeValue, kernel, ctor) {
    return new ctor(nodeValue);
  }
}

export abstract class SyntheticDOMValueNode extends SyntheticDOMNode {

  private _nodeValue: string;

  public targetNode: SyntheticDOMValueNode;

  constructor(nodeName: string, nodeValue: string) {
    super(nodeName);
    this.nodeValue = nodeValue;
  }

  get nodeValue() {
    return this._nodeValue;
  }

  set nodeValue(value: string) {
    this._nodeValue = String(value);

    this.notify(new PropertyMutation(SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT, this, "nodeValue", value).toEvent(true));
  }

  createEdit() {
    return new SyntheticDOMValueNodeEdit(this);
  }

  createEditor() {
    return new GroupEditor(new DOMValueNodeEditor(this), super.createEditor());
  }
}