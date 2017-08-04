import { BaseSyntheticWindowRenderer } from "./base";

export class SyntheticDOMRenderer extends BaseSyntheticWindowRenderer {
  readonly mount: HTMLElement;
  constructor(sourceWindow: Window, readonly targetDocument: Document) {
    super(sourceWindow);
    this.mount = targetDocument.createElement("div");
  }

  protected _onDocumentLoad(event: Event) {
    super._onDocumentLoad(event);
    console.log("LOAD")
    this.mount.innerHTML = this.sourceWindow.document.body.innerHTML;
  }
}

export const createSyntheticDOMRendererFactory = (targetDocument: Document) => (window: Window) => new SyntheticDOMRenderer(window, targetDocument);