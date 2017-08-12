import { getSEnvEventTargetClass, getSEnvEventClasses } from "../events";

const EventTarget = getSEnvEventTargetClass();
const { SEnvEvent } = getSEnvEventClasses();

export interface SyntheticWindowRenderer {
  mount: HTMLElement;
  sourceWindow: Window;
  getBoundingClientRect(element: HTMLElement): ClientRect;
  getComputedStyle(element: HTMLElement, pseudoElement?: HTMLElement): CSSStyleDeclaration;
}

export type SyntheticDOMRendererFactory = (window: Window) => SyntheticWindowRenderer;

export interface RenderedClientRects {
  [identifier: string]: ClientRect
};

export abstract class BaseSyntheticWindowRenderer extends EventTarget implements SyntheticWindowRenderer {
  abstract readonly mount: HTMLElement;
  private _rects: RenderedClientRects;

  constructor(protected _sourceWindow: Window) {
    super();
    this._onDocumentLoad = this._onDocumentLoad.bind(this) ;
    this._addTargetListeners();
  }

  get clientRects(): RenderedClientRects {
    return this._rects;
  }

  get sourceWindow(): Window {
    return this._sourceWindow;
  }

  getBoundingClientRect(element: HTMLElement): ClientRect {
    return null;
  }

  getComputedStyle(element: HTMLElement, pseudoElement?: HTMLElement): CSSStyleDeclaration {
    return null;
  }

  protected _removeTargetListeners() {

  }

  protected _addTargetListeners() {
    this._sourceWindow.document.addEventListener("load", this._onDocumentLoad);
  }

  protected _onDocumentLoad(event: Event) {
    
  }

  protected setClientRects(rects: RenderedClientRects) {
    const event = new SEnvEvent();
  }
}
