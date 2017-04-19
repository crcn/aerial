import { DOMNodeType } from "./node-types";
import { SyntheticDOMNode, SyntheticDOMNodeEdit, SyntheticDOMNodeEditor } from "./node";
import { SyntheticDOMText } from "./text-node";
import { DOMNodeEvent } from "@tandem/synthetic-browser/messages";
import nwmatcher =  require("nwmatcher");
import {
  Mutation,
  TreeNode,
  diffArray,
  filterTree,
  ITreeWalker,
  findTreeNode,
  RemoveMutation,
  PropertyMutation,
  MoveChildMutation,
  RemoveChildMutation,
  InsertChildMutation,
  TreeNodeMutationTypes,
} from "@tandem/common";
import { SyntheticHTMLCollection } from "../collections";
import { ISelectorTester, querySelector, querySelectorAll } from "../selector";
import { SyntheticDOMElement } from "./element";
import {
  IEditor,
  BaseEditor,
  GroupEditor,
  IContentEdit,
  BaseContentEdit,
  ISyntheticObject,
} from "@tandem/sandbox";

export namespace SyntheticDOMContainerMutationTypes {
  export const INSERT_CHILD_NODE_EDIT = TreeNodeMutationTypes.NODE_ADDED;
  export const REMOVE_CHILD_NODE_EDIT = TreeNodeMutationTypes.NODE_REMOVED;
  export const MOVE_CHILD_NODE_EDIT   = "moveChildNodeEdit";
}

export function isDOMContainerMutation(mutation: Mutation<any>) {
  return !!{
    [SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT]: true,
    [SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT]: true,
    [SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT]: true
  }[mutation.type];
}

export class SyntheticDOMContainerEdit<T extends SyntheticDOMContainer> extends SyntheticDOMNodeEdit<T> {

  insertChild(newChild: SyntheticDOMNode, index: number) {

    // Clone child here to freeze it from any changes. It WILL be cloned again, but that's also important to ensure
    // that this edit can be applied to multiple targets.
    return this.addChange(new InsertChildMutation(SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT, this.target, newChild.cloneNode(true), index));
  }

  removeChild(child: SyntheticDOMNode) {
    return this.addChange(new RemoveChildMutation(SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT, this.target, child, this.target.childNodes.indexOf(child)));
  }

  moveChild(child: SyntheticDOMNode, index: number, patchedOldIndex?: number) {
    return this.addChange(new MoveChildMutation(SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT, this.target, child, patchedOldIndex || this.target.childNodes.indexOf(child), index));
  }

  appendChild(newChild: SyntheticDOMNode) {
    return this.insertChild(newChild, Number.MAX_SAFE_INTEGER);
  }

  remove() {
    return this.addChange(new RemoveMutation(this.target));
  }

  protected addDiff(newContainer: SyntheticDOMContainer) {
    diffArray(this.target.childNodes, newContainer.childNodes, (oldNode, newNode) => {
      if (oldNode.nodeName !== newNode.nodeName || oldNode.namespaceURI !== newNode.namespaceURI) return -1;
      return 0;
    }).accept({
      visitInsert: ({ index, value }) => {
        this.insertChild(value, index);
      },
      visitRemove: ({ index }) => {
        this.removeChild(this.target.childNodes[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, index }) => {
        if (patchedOldIndex !== index) {
          this.moveChild(this.target.childNodes[originalOldIndex], index, patchedOldIndex);
        }
        const oldValue = this.target.childNodes[originalOldIndex];
        this.addChildEdit(oldValue.createEdit().fromDiff(newValue));
      }
    });
    return super.addDiff(newContainer as T);
  }
}

export class DOMContainerEditor<T extends SyntheticDOMContainer|Element|Document|DocumentFragment> extends BaseEditor<T> {
  constructor(readonly target: T, readonly createNode:(source: any) => any = (source) => source.cloneNode(true)) {
    super(target);
  }

  applySingleMutation(mutation: Mutation<any>) {
    if (mutation.type === SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT) {
      const { child, index } = <InsertChildMutation<any, SyntheticDOMNode>>mutation;
      (<Element>this.target).removeChild(this.target.childNodes[index] as any);
    } if (mutation.type === SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT) {
      const moveMutation = <MoveChildMutation<any, SyntheticDOMNode>>mutation;
      this._insertChildAt(this.target.childNodes[moveMutation.oldIndex] as any, moveMutation.index);
    } else if (mutation.type === SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT) {
      const insertMutation = <InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>>mutation;
      const newChild = this.createNode(insertMutation.child);
      this._insertChildAt(newChild, insertMutation.index);
    }
  }

  private _insertChildAt(child: any, index: number) {

    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    if (index === this.target.childNodes.length) {
      (<SyntheticDOMContainer>this.target).appendChild(child);
    } else {
      const existingChild = this.target.childNodes[index] as Element;
      (<Element>this.target).insertBefore(child, existingChild);
    }
  }
}

export class SyntheticDOMContainerEditor<T extends SyntheticDOMContainer> extends BaseEditor<T> {

  private _domContainerEditor: DOMContainerEditor<SyntheticDOMContainer>;
  private _nodeEditor: SyntheticDOMNodeEditor<SyntheticDOMContainer>;

  constructor(target: T) {
    super(target);
    this._domContainerEditor = this.createDOMEditor(target);
    this._nodeEditor = new SyntheticDOMNodeEditor(target); 
  }

  protected createDOMEditor(target: SyntheticDOMContainer) {
    return new DOMContainerEditor(target);
  }

  applyMutations(mutations: Mutation<any>[]) {
    super.applyMutations(mutations);
    this._domContainerEditor.applyMutations(mutations);
    this._nodeEditor.applyMutations(mutations);

  }
}

export abstract class SyntheticDOMContainer extends SyntheticDOMNode {

  createEdit(): SyntheticDOMContainerEdit<any> {
    return new SyntheticDOMContainerEdit(this);
  }

  getChildSyntheticByUID(uid): ISyntheticObject {
    return findTreeNode(this, child => child.uid === uid);
  }

  // TODO - insertBefore here
  appendChild(child: SyntheticDOMNode) {
    if (child.nodeType === DOMNodeType.DOCUMENT_FRAGMENT) {
      child.children.concat().forEach((child) => this.appendChild(child));
      return child;
    }
    return super.appendChild(child);
  }

  get textContent() {
    return this.childNodes.map(child => child.textContent).join("");
  }

  set textContent(value) {
    this.removeAllChildren();
    this.appendChild(this.ownerDocument.createTextNode(value));
  }

  toString() {
    return this.childNodes.map(child => child.toString()).join("");
  }

  public querySelector(selector: string): SyntheticDOMElement {
    return querySelector(this, selector);
  }

  public querySelectorAll(selector: string): SyntheticDOMElement[] {
    return querySelectorAll(this, selector);
  }

  public getElementsByTagName(tagName: string) {
    return SyntheticHTMLCollection.create(...filterTree(this, (node) => {
      return node.nodeType === DOMNodeType.ELEMENT && (tagName === "*" || node.nodeName === tagName);
    })) as any as SyntheticHTMLCollection<SyntheticDOMElement>;
  }

  public getElementsByClassName(className: string) {
    return SyntheticHTMLCollection.create(...this.querySelectorAll("." + className)) as SyntheticHTMLCollection<SyntheticDOMElement>;
  }

  createEditor() {
    return new SyntheticDOMContainerEditor(this);
  }

  visitWalker(walker: ITreeWalker) {
    this.childNodes.forEach(child => walker.accept(child));
  }
}

function isShadowRootOrDocument(node: SyntheticDOMNode) {
  return (node.nodeType === DOMNodeType.DOCUMENT_FRAGMENT || node.nodeType === DOMNodeType.DOCUMENT);
}