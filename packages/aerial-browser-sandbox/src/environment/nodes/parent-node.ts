import { weakMemo } from "aerial-common2";
import { getSEnvNodeClass, SEnvNodeInterface } from "./node";
import { getSEnvHTMLCollectionClasses } from "./collections";
import { getDOMExceptionClasses } from "./exceptions";
import { getL3EventClasses } from "../level3";
import { SEnvNodeTypes } from "../constants";
import { querySelector, querySelectorAll } from "./utils";

export interface SEnvParentNodeInterface extends ParentNode, Node {
}

export const getSEnvParentNodeClass = weakMemo((context: any) => {

  const SEnvNode = getSEnvNodeClass(context);
  const { SEnvDOMException } = getDOMExceptionClasses(context);
  const { SEnvHTMLCollection } = getSEnvHTMLCollectionClasses(context);
  const { SEnvMutationEvent } = getL3EventClasses(context);

  return class SEnvParentNode extends SEnvNode implements ParentNode {
    children: HTMLCollection;

    $$preconstruct() {
      super.$$preconstruct();
      this.children = new SEnvHTMLCollection().$init(this);
    }

    appendChild<T extends Node>(child: T) {
      return this._insertChild(child, this.childNodes.length);
    }

    insertBefore<T extends Node>(newChild: T, refChild: Node | null): T {
      const index = Array.prototype.indexOf.call(this.childNodes, refChild);

      if (index === -1) {
        throw new SEnvDOMException(`Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.`);
      }

      return this._insertChild(newChild, index);
    }

    private _insertChild<T extends Node>(child: T, index: number) {
      if (child.nodeType === SEnvNodeTypes.DOCUMENT_FRAGMENT) {
        while(child.childNodes.length) {
          this._insertChild(child.lastChild, index);
        }
        return child;
      }
      this._linkChild(child as any as SEnvNodeInterface);
      this.$childNodesArray.splice(index, 0, child);
      if (this.connectedToDocument) {
        (child as any as SEnvNodeInterface).$$addedToDocument();
      }
      const event = new  SEnvMutationEvent();
      event.initMutationEvent("DOMNodeInserted", true, true, child, null, null, null, -1);
      this.dispatchEvent(event);
      return child;
    }

    removeChild<T extends Node>(child: T) {
      const index = this.$childNodesArray.indexOf(child);
      if (index === -1) {
        throw new SEnvDOMException("The node to be removed is not a child of this node.");
      }
      this.$childNodesArray.splice(index, 1);
      const event = new SEnvMutationEvent();
      event.initMutationEvent("DOMNodeRemoved", true, true, child, null, null, null, -1);
      this.dispatchEvent(event);
      return child;
    }

    querySelector<K extends keyof ElementTagNameMap>(selectors: K): ElementTagNameMap[K] | null;
    querySelector(selectors: string): Element | null {
      return querySelector(this, selectors);
    }

    querySelectorAll<K extends keyof ElementListTagNameMap>(selectors: K): ElementListTagNameMap[K];
    querySelectorAll(selectors: string): NodeListOf<Element> {
      return null;
    }
    
    replaceChild<T extends Node>(newChild: Node, oldChild: T): T {
      const index = this.$childNodesArray.indexOf(oldChild);
      if (index === -1) {
        throw new SEnvDOMException("The node to be replaced is not a child of this node.");
      }
      this.$childNodesArray.splice(index, 1, newChild);
      return oldChild;
    }

    get firstElementChild() {
      return this.children[0];
    }

    get textContent() {
      return Array.prototype.map.call(this.childNodes, (child) => child.textContent).join("");
    }

    set textContent(value: string) {
      this._throwUnsupportedMethod();
    }

    protected removeAllChildren() {
      while(this.childNodes.length) {
        this.removeChild(this.childNodes[0]);
      }
    }

    get lastElementChild() {
      return this.children[this.children.length - 1];
    }

    get childElementCount() {
      return this.children.length;
    }

    protected _linkChild(child: SEnvNodeInterface) {
      if (child.$$parentNode) {
        child.$$parentNode.removeChild(child);
      }
      child.$$parentNode = this;
    }

    protected _unlinkChild(child: SEnvNodeInterface) {
      child.$$parentNode = null;
      if (child.connectedToDocument) {
        child.$$removedFromDocument();
      }
    }
    
    $$addedToDocument() {
      super.$$addedToDocument();
      for (const child of Array.prototype.slice.call(this.childNodes)) {
        child.$$addedToDocument();
      }
    }
  }
});