import { SyntheticDOMNode, SyntheticDOMNodeEdit } from "./node";
import { ISerializer, Mutation, SetValueMutation } from "aerial-common";
import { BaseEditor, GroupEditor } from "aerial-sandbox";
export declare namespace SyntheticDOMValueNodeMutationTypes {
    const SET_VALUE_NODE_EDIT = "setValueNodeEdit";
}
export declare class SyntheticDOMValueNodeEdit extends SyntheticDOMNodeEdit<SyntheticDOMValueNode> {
    setValueNode(nodeValue: string): SetValueMutation<SyntheticDOMValueNode>;
    addDiff(newValueNode: SyntheticDOMValueNode): this;
}
export declare class DOMValueNodeEditor<T extends SyntheticDOMValueNode | Text | Comment> extends BaseEditor<T> {
    applySingleMutation(mutation: Mutation<T>): void;
}
export declare function isDOMValueNodeMutation(mutation: Mutation<SyntheticDOMValueNode>): boolean;
export declare class SyntheticDOMValueNodeSerializer implements ISerializer<SyntheticDOMValueNode, string> {
    serialize({nodeValue}: SyntheticDOMValueNode): string;
    deserialize(nodeValue: any, kernel: any, ctor: any): any;
}
export declare abstract class SyntheticDOMValueNode extends SyntheticDOMNode {
    private _nodeValue;
    targetNode: SyntheticDOMValueNode;
    constructor(nodeName: string, nodeValue: string);
    nodeValue: string;
    createEdit(): SyntheticDOMValueNodeEdit;
    createEditor(): GroupEditor;
}
