import { SEnvNodeTypes } from "../constants";
import { SEnvNodeInterface } from "../nodes";
import { BaseSyntheticWindowRenderer } from "./base";


export class SyntheticDOMRenderer extends BaseSyntheticWindowRenderer {
  readonly mount: HTMLElement;
  constructor(sourceWindow: Window, readonly targetDocument: Document) {
    super(sourceWindow);
    this.mount = targetDocument.createElement("div");
  }

  protected _onDocumentLoad(event: Event) {
    super._onDocumentLoad(event);
    const css = Array.prototype.map.call(this.sourceWindow.document.stylesheets, (ss: CSSStyleSheet) => (
      ss.cssText
    )).join("\n");
    
    const html = this.sourceWindow.document.body.innerHTML;

    this.mount.innerHTML = `<style>${css}</style><span>${html}</span>`;

    this._resetClientRects();
  }

  private _resetClientRects() {
    const targetWindow = this.targetDocument.defaultView;
    const body = this.mount.lastChild;

    const boundingClientRects = {};
    const computedStyles = {};
    eachMatchingElement(this.sourceWindow.document.body as any as SEnvNodeInterface, body, (a, b) => {
      if (b.nodeType === SEnvNodeTypes.ELEMENT) {
        boundingClientRects[a.uid] = (b as Element).getBoundingClientRect();
      }
    });
  }
}

const eachMatchingElement = (a: SEnvNodeInterface, b: Node, each: (a: SEnvNodeInterface, b: Node) => any) => {
  each(a, b);
  Array.prototype.forEach.call(a.childNodes, (ac, i) => {
    eachMatchingElement(ac, b.childNodes[i], each);
  });
};

export const createSyntheticDOMRendererFactory = (targetDocument: Document) => (window: Window) => new SyntheticDOMRenderer(window, targetDocument);