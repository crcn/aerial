import { getSEnvEventTargetClass, getSEnvEventClasses, SEnvMutationEventInterface } from "../events";
import { SEnvWindowInterface } from "../window";
import { SEnvElementInterface } from "../nodes/element";
import { Rectangle, Point } from "aerial-common2";

const EventTarget = getSEnvEventTargetClass();
const { SEnvEvent, SEnvMutationEvent } = getSEnvEventClasses();

export interface SyntheticWindowRendererInterface extends EventTarget {
  container: HTMLElement;
  sourceWindow: Window;
  readonly allBoundingClientRects: RenderedClientRects;
  getBoundingClientRect(element: SEnvElementInterface): ClientRect;
  getComputedStyle(element: SEnvElementInterface, pseudoElement?: SEnvElementInterface): CSSStyleDeclaration;
}

export type SyntheticDOMRendererFactory = (window: Window) => SyntheticWindowRendererInterface;

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
  scrollPosition: Point;
  scrollRect: Rectangle;

  initRendererEvent(type: string, rects: RenderedClientRects, styles: RenderedComputedStyleDeclarations, scrollRect: Rectangle, scrollPosition) {
    super.initEvent(type, true, true);
    this.rects = rects;
    this.styles = styles;
    this.scrollRect = scrollRect;
    this.scrollPosition = scrollPosition;
  }
}

export abstract class BaseSyntheticWindowRenderer extends EventTarget implements SyntheticWindowRendererInterface {
  abstract readonly container: HTMLElement;
  private _rects: RenderedClientRects;
  private _scrollWidth: number;
  private _scrollHeight: number;
  private _styles: RenderedComputedStyleDeclarations;

  constructor(protected _sourceWindow: SEnvWindowInterface) {
    super();
    this._onDocumentLoad = this._onDocumentLoad.bind(this);
    this._onDocumentReadyStateChange = this._onDocumentReadyStateChange.bind(this);
    this._onWindowResize = this._onWindowResize.bind(this);
    this._onWindowScroll = this._onWindowScroll.bind(this);
    this._onWindowMutation = this._onWindowMutation.bind(this);
    this._addTargetListeners();
  }

  get allBoundingClientRects() {
    return this._rects;
  }

  get clientRects(): RenderedClientRects {
    return this._rects;
  }

  get sourceWindow(): SEnvWindowInterface {
    return this._sourceWindow;
  }

  getBoundingClientRect(element: SEnvElementInterface): ClientRect {
    return this._rects && this._rects[element.$id];
  }

  getComputedStyle(element: SEnvElementInterface, pseudoElement?: SEnvElementInterface): CSSStyleDeclaration {
    return this._styles && this._styles[element.$id];
  }

  protected _removeTargetListeners() {

  }

  protected _addTargetListeners() {
    this._sourceWindow.document.addEventListener("readystatechange", this._onDocumentReadyStateChange);
    this._sourceWindow.addEventListener("resize", this._onWindowResize);
    this._sourceWindow.addEventListener("scroll", this._onWindowScroll);
  }

  protected _onDocumentReadyStateChange(event: Event) {
    if (this._sourceWindow.document.readyState === "complete") {
      this._onDocumentLoad(event);
    }
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

  protected setPaintedInfo(rects: RenderedClientRects, styles: RenderedComputedStyleDeclarations, scrollRect: Rectangle, scrollPosition: Point) {
    this._rects = rects;
    this._styles = styles;
    const event = new SyntheticWindowRendererEvent();
    event.initRendererEvent(SyntheticWindowRendererEvent.PAINTED, rects, styles, scrollRect, scrollPosition);
    this.dispatchEvent(event);
  }
}
