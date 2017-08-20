import { getSEnvEventTargetClass, getSEnvEventClasses, SEnvMutationEventInterface } from "../events";
import { SEnvWindowInterface } from "../window";
import { SEnvElementInterface } from "../nodes/element";

const EventTarget = getSEnvEventTargetClass();
const { SEnvEvent, SEnvMutationEvent } = getSEnvEventClasses();

export interface SyntheticWindowRenderer extends EventTarget {
  mount: HTMLElement;
  sourceWindow: Window;
  getBoundingClientRect(element: SEnvElementInterface): ClientRect;
  getComputedStyle(element: SEnvElementInterface, pseudoElement?: SEnvElementInterface): CSSStyleDeclaration;
}

export type SyntheticDOMRendererFactory = (window: Window) => SyntheticWindowRenderer;

export interface RenderedClientRects {
  [identifier: string]: ClientRect
};


export interface RenderedComputedStyleDeclarations {
  [identifier: string]: CSSStyleDeclaration
};

export class SyntheticWindowRendererEvent extends SEnvEvent {
  static readonly PAINTED = "PAINTED";
  rects: RenderedClientRects;
  styles: RenderedComputedStyleDeclarations;
  initRendererEvent(type: string, rects: RenderedClientRects, styles: RenderedComputedStyleDeclarations) {
    super.initEvent(type, true, true);
    this.rects = rects;
    this.styles = styles;
  }
}

export abstract class BaseSyntheticWindowRenderer extends EventTarget implements SyntheticWindowRenderer {
  abstract readonly mount: HTMLElement;
  private _rects: RenderedClientRects;
  private _styles: RenderedComputedStyleDeclarations;

  constructor(protected _sourceWindow: SEnvWindowInterface) {
    super();
    this._onDocumentLoad = this._onDocumentLoad.bind(this);
    this._onDocumentLoad2 = this._onDocumentLoad2.bind(this);
    this._onWindowResize = this._onWindowResize.bind(this);
    this._onWindowScroll = this._onWindowScroll.bind(this);
    this._onWindowMutation = this._onWindowMutation.bind(this);
    this._addTargetListeners();
  }

  get clientRects(): RenderedClientRects {
    return this._rects;
  }

  get sourceWindow(): Window {
    return this._sourceWindow;
  }

  getBoundingClientRect(element: SEnvElementInterface): ClientRect {
    return this._rects && this._rects[element.uid];
  }

  getComputedStyle(element: SEnvElementInterface, pseudoElement?: SEnvElementInterface): CSSStyleDeclaration {
    return this._styles && this._styles[element.uid];
  }

  protected _removeTargetListeners() {

  }

  protected _addTargetListeners() {
    this._sourceWindow.document.addEventListener("load", this._onDocumentLoad2);
    this._sourceWindow.addEventListener("resize", this._onWindowResize);
    this._sourceWindow.addEventListener("scroll", this._onWindowScroll);
  }

  private _onDocumentLoad2(event: Event) {
    if (event.target !== this._sourceWindow.document) return;
    this._onDocumentLoad(event);
  }


  protected _onDocumentLoad(event: Event) {

    // document load is when the page is visible to the user, so only listen for 
    // mutations after stuff is loaded in (They'll be fired as the document is loaded in) (CC)
    this._sourceWindow.addEventListener(SEnvMutationEvent.MUTATION, this._onWindowMutation);
  }

  protected _onWindowResize(event: Event) {

  }

  protected _onWindowScroll(event: Event) {
    
  }

  protected _onWindowMutation(event: SEnvMutationEventInterface) {

  }

  protected setPaintedInfo(rects: RenderedClientRects, styles: RenderedComputedStyleDeclarations) {
    this._rects = rects;
    this._styles = styles;
    const event = new SyntheticWindowRendererEvent();
    event.initRendererEvent(SyntheticWindowRendererEvent.PAINTED, rects, styles);
    this.dispatchEvent(event);
  }
}
