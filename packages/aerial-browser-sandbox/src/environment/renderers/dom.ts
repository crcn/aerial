import { debounce } from "lodash";
import { SEnvNodeTypes } from "../constants";
import { SEnvNodeInterface } from "../nodes";
import { SEnvWindowInterface, patchWindow, patchNode } from "../window";
import { SEnvParentNodeMutationTypes, createParentNodeInsertChildMutation, SEnvParentNodeInterface, SEnvCommentInterface, SEnvElementInterface, SEnvTextInterface } from "../nodes";
import { SEnvMutationEventInterface } from "../events";
import { BaseSyntheticWindowRenderer } from "./base";
import { InsertChildMutation, RemoveChildMutation, MoveChildMutation } from "aerial-common2";

const NODE_NAME_MAP = {
  head: "span",
  html: "span",
  body: "span",
  link: "span",
  script: "span",
};

const getNodePath = (node: Node, root: Node) => {
  const path = [];
  let current = node;
  while(current !== root) {
    path.unshift(Array.prototype.indexOf.call(current.parentNode.childNodes, current));
    current = current.parentNode;
  }
  return path;
}

const getNodeByPath = (path: string[], root: Node) => {
  let current = root;
  for (const part of path) {
    current = current.childNodes[part];
  }
  return current;
}

export class SyntheticDOMRenderer extends BaseSyntheticWindowRenderer {
  readonly mount: HTMLElement;
  constructor(sourceWindow: SEnvWindowInterface, readonly targetDocument: Document) {
    super(sourceWindow);
    this.mount = targetDocument.createElement("div");
    this._deferRecalc = debounce(this._deferRecalc.bind(this), 1);
  }

  protected _onDocumentLoad(event: Event) {
    super._onDocumentLoad(event);
    const css = Array.prototype.map.call(this.sourceWindow.document.stylesheets, (ss: CSSStyleSheet) => (
      ss.cssText
    )).join("\n");
    
    const html = this.sourceWindow.document.body.innerHTML;

    this.mount.innerHTML = `<style>${css}</style><span></span>`;
    this.mount.lastElementChild.appendChild(mapNode(this.sourceWindow.document.documentElement as any as SEnvElementInterface, this.targetDocument));

    this._resetClientRects();
  }

  protected _onWindowMutation({ mutation }: SEnvMutationEventInterface) {
    const targetNode = getNodeByPath(getNodePath(this._sourceWindow.childObjects.get(mutation.target.uid), this._sourceWindow.document), this.mount.lastElementChild);

    if (mutation.$$type === SEnvParentNodeMutationTypes.MOVE_CHILD_NODE_EDIT) {
    } else if (mutation.$$type === SEnvParentNodeMutationTypes.INSERT_CHILD_NODE_EDIT) {
      const insertChildMutation = mutation as InsertChildMutation<any, any>;
      mutation = createParentNodeInsertChildMutation(targetNode as SEnvParentNodeInterface, mapNode(insertChildMutation.child.cloneNode(true), this.targetDocument), insertChildMutation.index);
    } else if (mutation.$$type === SEnvParentNodeMutationTypes.REMOVE_CHILD_NODE_EDIT) {
    }

    patchNode(targetNode, mutation);
    this._deferRecalc();
  }

  private _deferRecalc() {
    this._resetClientRects();
  }

  protected _onWindowResize(event: Event) {
    this._resetClientRects();
  }

  private _resetClientRects() {
    const targetWindow = this.targetDocument.defaultView;
    const body = this.mount.lastChild;

    const boundingClientRects = {};
    const computedStyles = {};
    Array.prototype.forEach.call(this.mount.lastElementChild.querySelectorAll("*"), (element) => {
      const sourceUID = element.dataset.sourceUID;
      boundingClientRects[sourceUID] = element.getBoundingClientRect();
      computedStyles[sourceUID] = targetWindow.getComputedStyle(element);
    });

    this.setPaintedInfo(boundingClientRects, computedStyles);
  }
}

const eachMatchingElement = (a: SEnvNodeInterface, b: Node, each: (a: SEnvNodeInterface, b: Node) => any) => {
  each(a, b);
  Array.prototype.forEach.call(a.childNodes, (ac, i) => {
    eachMatchingElement(ac, b.childNodes[i], each);
  });
};

const mapNode = (a: SEnvNodeInterface, document: Document) => {
  let b: Node;
  switch(a.nodeType) {
    case SEnvNodeTypes.TEXT: 
      b = document.createTextNode((a as SEnvTextInterface).nodeValue);
    break;
    case SEnvNodeTypes.ELEMENT: 
      const el = a as SEnvElementInterface;
      const bel = document.createElement(NODE_NAME_MAP[el.nodeName.toLowerCase()] || el.nodeName) as HTMLElement;
      bel.dataset.sourceUID = a.uid;
      if (el.nodeName.toLowerCase() === "script") {
        bel.style.display = "none";
      }
      for (let i = 0, n = el.attributes.length; i < n; i++) {
        bel.setAttribute(el.attributes[i].name, el.attributes[i].value);
      }
      for (const child of Array.from(el.childNodes)) {
        bel.appendChild(mapNode(child as SEnvNodeInterface, document));
      }
      b = bel;
    break;
    case SEnvNodeTypes.COMMENT: 
      b = document.createComment((a as SEnvCommentInterface).nodeValue);
    break;
  }
  
  return b;
}

export const createSyntheticDOMRendererFactory = (targetDocument: Document) => (window: SEnvWindowInterface) => new SyntheticDOMRenderer(window, targetDocument);
