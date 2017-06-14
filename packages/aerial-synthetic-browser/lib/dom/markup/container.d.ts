import { SyntheticDOMNode, SyntheticDOMNodeEdit } from "./node";
import { Mutation, ITreeWalker, RemoveMutation, MoveChildMutation, RemoveChildMutation, InsertChildMutation } from "aerial-common";
import { SyntheticHTMLCollection } from "../collections";
import { SyntheticDOMElement } from "./element";
import { BaseEditor, ISyntheticObject } from "aerial-sandbox";
export declare namespace SyntheticDOMContainerMutationTypes {
    const INSERT_CHILD_NODE_EDIT = "nodeAdded";
    const REMOVE_CHILD_NODE_EDIT = "nodeRemoved";
    const MOVE_CHILD_NODE_EDIT = "moveChildNodeEdit";
}
export declare function isDOMContainerMutation(mutation: Mutation<any>): boolean;
export declare class SyntheticDOMContainerEdit<T extends SyntheticDOMContainer> extends SyntheticDOMNodeEdit<T> {
    insertChild(newChild: SyntheticDOMNode, index: number): InsertChildMutation<T, any>;
    removeChild(child: SyntheticDOMNode): RemoveChildMutation<T, SyntheticDOMNode>;
    moveChild(child: SyntheticDOMNode, index: number, patchedOldIndex?: number): MoveChildMutation<T, SyntheticDOMNode>;
    appendChild(newChild: SyntheticDOMNode): InsertChildMutation<T, any>;
    remove(): RemoveMutation<T>;
    protected addDiff(newContainer: SyntheticDOMContainer): this;
}
export declare class DOMContainerEditor<T extends SyntheticDOMContainer | Element | Document | DocumentFragment> extends BaseEditor<T> {
    readonly target: T;
    readonly createNode: (source: any) => any;
    constructor(target: T, createNode?: (source: any) => any);
    applySingleMutation(mutation: Mutation<any>): void;
    private _insertChildAt(child, index);
}
export declare class SyntheticDOMContainerEditor<T extends SyntheticDOMContainer> extends BaseEditor<T> {
    private _domContainerEditor;
    private _nodeEditor;
    constructor(target: T);
    protected createDOMEditor(target: SyntheticDOMContainer): DOMContainerEditor<SyntheticDOMContainer>;
    applyMutations(mutations: Mutation<any>[]): void;
}
export declare abstract class SyntheticDOMContainer extends SyntheticDOMNode {
    createEdit(): SyntheticDOMContainerEdit<any>;
    getChildSyntheticByUID(uid: any): ISyntheticObject;
    appendChild(child: SyntheticDOMNode): SyntheticDOMNode;
    textContent: string;
    toString(): string;
    querySelector(selector: string): SyntheticDOMElement;
    querySelectorAll(selector: string): SyntheticDOMElement[];
    getElementsByTagName(tagName: string): any;
    getElementsByClassName(className: string): SyntheticHTMLCollection<SyntheticDOMElement>;
    createEditor(): SyntheticDOMContainerEditor<this>;
    visitWalker(walker: ITreeWalker): void;
}
