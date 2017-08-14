import { SEnvNodeTypes } from "../constants";
import { SEnvNodeInterface } from "../nodes";
import { SEnvWindowInterface, patchWindow, patchNode } from "../window";
import { SEnvMutationEventInterface } from "../events";
import { BaseSyntheticWindowRenderer } from "./base";
import { debounce } from "lodash";

export class SyntheticDOMRenderer extends BaseSyntheticWindowRenderer {
  readonly mount: HTMLElement;
  private _nodeMap: Map<SEnvNodeInterface, Node>;
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
    this._nodeMap = mapNode(this.sourceWindow.document.body, this.targetDocument);
    this.mount.querySelector("span").appendChild(this._nodeMap.get(this.sourceWindow.document.body as any as SEnvNodeInterface));

    this._resetClientRects();
  }

  protected _onWindowMutation({ mutation }: SEnvMutationEventInterface) {
    const sourceNode = this._sourceWindow.childObjects.get(mutation.target.uid);
    const targetNode = this._nodeMap.get(sourceNode);
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
    this._nodeMap.forEach((b, a) => {
      if (b.nodeType === SEnvNodeTypes.ELEMENT) {
        boundingClientRects[a.uid] = (b as Element).getBoundingClientRect();
        computedStyles[a.uid] = targetWindow.getComputedStyle(b as Element);
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

const mapNode = (a: Node, document: Document, map: Map<SEnvNodeInterface, Node> = new Map()) => {
  let b: Node;
  switch(a.nodeType) {
    case SEnvNodeTypes.TEXT: 
      b = document.createTextNode((a as Comment).nodeValue);
    break;
    case SEnvNodeTypes.ELEMENT: 
      const el = a as Element;
      const bel = document.createElement(el.nodeName);
      for (let i = 0, n = el.attributes.length; i < n; i++) {
        bel.setAttribute(el.attributes[i].name, el.attributes[i].value);
      }
      for (const child of Array.from(el.childNodes)) {
        bel.appendChild(mapNode(child, document, map).get(child as SEnvNodeInterface));
      }
      b = bel;
    break;
    case SEnvNodeTypes.COMMENT: 
      b = document.createComment((a as Comment).nodeValue);
    break;
  }


  map.set(a as SEnvNodeInterface, b);

  return map;
}

export const createSyntheticDOMRendererFactory = (targetDocument: Document) => (window: Window) => new SyntheticDOMRenderer(window, targetDocument);