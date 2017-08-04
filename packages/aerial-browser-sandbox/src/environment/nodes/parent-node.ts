import { weakMemo } from "aerial-common2";
import { getSEnvNodeClass, SEnvNodeAddon } from "./node";
import { getSEnvHTMLCollectionClasses } from "./collections";
import { getDOMExceptionClasses } from "./exceptions";
import { getL3EventClasses } from "../level3";

export const getSEnvParentNodeClass = weakMemo((context: any) => {

  const SEnvNode = getSEnvNodeClass(context);
  const { SEnvDOMException } = getDOMExceptionClasses(context);
  const { SEnvHTMLCollection } =  getSEnvHTMLCollectionClasses(context);
  const { SEnvMutationEvent } = getL3EventClasses(context);

  return class SEnvParentNode extends SEnvNode implements ParentNode {
    children: HTMLCollection;

    $preconstruct() {
      super.$preconstruct();
      this.children = new SEnvHTMLCollection().$init(this);
    }

    appendChild<T extends Node>(child: T) {
      this._linkChild(child as any as SEnvNodeAddon);
      this.$childNodesArray.push(child);
      if (this.$connectedToDocument) {
        (child as any as SEnvNodeAddon).$$addedToDocument();
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

    protected _linkChild(child: SEnvNodeAddon) {
      if (child.$$parentNode) {
        child.$$parentNode.removeChild(child);
      }
      child.$$parentNode = this;
    }

    protected _unlinkChild(child: SEnvNodeAddon) {
      child.$$parentNode = null;
      if (child.$connectedToDocument) {
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