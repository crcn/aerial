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
  body: "span",
  link: "span",
  script: "span",
};

export class SyntheticDOMRenderer extends BaseSyntheticWindowRenderer {
  readonly mount: HTMLElement;
  private _nodeMap: Map<string, Node>;
  constructor(sourceWindow: SEnvWindowInterface, readonly targetDocument: Document) {
    super(sourceWindow);
    this.mount = targetDocument.createElement("div");
    this._deferRecalc = debounce(this._deferRecalc.bind(this), 1);
  }

  protected _onDocumentLoad(event: Event) {
    super._onDocumentLoad(event);
    console.log("DOC LOAD");
    const css = Array.prototype.map.call(this.sourceWindow.document.stylesheets, (ss: CSSStyleSheet) => (
      ss.cssText
    )).join("\n");
    
    const html = this.sourceWindow.document.body.innerHTML;

    this.mount.innerHTML = `<style>${css}</style><span></span>`;
    this._nodeMap = mapNode(this.sourceWindow.document.documentElement as any as SEnvElementInterface, this.targetDocument);
    this.mount.querySelector("span").appendChild(this._nodeMap.get((this.sourceWindow.document.body as any as SEnvNodeInterface).uid));

    this._resetClientRects();
  }

  protected _onWindowMutation({ mutation }: SEnvMutationEventInterface) {
    const sourceNode = this._sourceWindow.childObjects.get(mutation.target.uid);
    const targetNode = this._nodeMap.get(sourceNode.uid);

    if (mutation.$$type === SEnvParentNodeMutationTypes.MOVE_CHILD_NODE_EDIT) {
    } else if (mutation.$$type === SEnvParentNodeMutationTypes.INSERT_CHILD_NODE_EDIT) {
      const insertChildMutation = mutation as InsertChildMutation<any, any>;
      const newChildMap = mapNode(insertChildMutation.child, this.targetDocument);
      newChildMap.forEach((value, key) => this._nodeMap.set(key, value));
      mutation = createParentNodeInsertChildMutation(targetNode as SEnvParentNodeInterface, newChildMap.get(insertChildMutation.child.uid), insertChildMutation.index);
    } else if (mutation.$$type === SEnvParentNodeMutationTypes.REMOVE_CHILD_NODE_EDIT) {
      deleteNodeTree((mutation as RemoveChildMutation<any, any>).child, this._nodeMap);
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
    this._nodeMap.forEach((b, uid) => {
      if (b.nodeType === SEnvNodeTypes.ELEMENT) {
        boundingClientRects[uid] = (b as Element).getBoundingClientRect();
        computedStyles[uid] = targetWindow.getComputedStyle(b as Element);
      }
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

const mapNode = (a: SEnvNodeInterface, document: Document, map: Map<string, Node> = new Map<string, Node>()) => {
  let b: Node;
  switch(a.nodeType) {
    case SEnvNodeTypes.TEXT: 
      b = document.createTextNode((a as SEnvTextInterface).nodeValue);
    break;
    case SEnvNodeTypes.ELEMENT: 
      const el = a as SEnvElementInterface;
      const bel = document.createElement(NODE_NAME_MAP[el.nodeName.toLowerCase()] || el.nodeName);
      for (let i = 0, n = el.attributes.length; i < n; i++) {
        bel.setAttribute(el.attributes[i].name, el.attributes[i].value);
      }
      for (const child of Array.from(el.childNodes)) {
        bel.appendChild(mapNode(child as SEnvNodeInterface, document, map).get((child as SEnvNodeInterface).uid));
      }
      b = bel;
    break;
    case SEnvNodeTypes.COMMENT: 
      b = document.createComment((a as SEnvCommentInterface).nodeValue);
    break;
  }


  map.set(a.uid, b);

  return map;
}

export const createSyntheticDOMRendererFactory = (targetDocument: Document) => (window: SEnvWindowInterface) => new SyntheticDOMRenderer(window, targetDocument);

const deleteNodeTree = (node: SEnvNodeInterface, map: Map<string, Node>) => {
  map.delete(node.uid);
  Array.prototype.forEach.call(node, child => {
    deleteNodeTree(child, map);
  });
};