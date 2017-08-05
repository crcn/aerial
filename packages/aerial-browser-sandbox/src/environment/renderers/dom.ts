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

    this.mount.innerHTML = `
      <style>
        ${css}
      </style>
      <span>
        ${html}
      </span>
    `;
  }
}

export const createSyntheticDOMRendererFactory = (targetDocument: Document) => (window: Window) => new SyntheticDOMRenderer(window, targetDocument);