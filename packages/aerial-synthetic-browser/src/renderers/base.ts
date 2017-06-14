import { values } from "lodash";
import { CoreEvent, MutationEvent } from "aerial-common";
import { CallbackBus, IBus } from "mesh";
import { SyntheticRendererEvent, DOMNodeEvent } from "../messages";

import {
  Logger,
  loggable,
  bindable,
  Observable,
  IObservable,
  BoundingRect,
  watchProperty,
  PropertyWatcher,
  PropertyMutation,
  MetadataChangeEvent,
  waitForPropertyChange,
} from "aerial-common";

import {
  DOMNodeType,
  SyntheticDOMNode,
  SyntheticDOMText,
  SyntheticDocument,
  SyntheticDOMElement,
  SyntheticCSSStyle,
} from "../dom";


export interface ISyntheticDocumentRenderer extends IObservable {
  readonly element: HTMLElement;
  document: SyntheticDocument;

  rects: any;

  rectsWatcher: PropertyWatcher<ISyntheticDocumentRenderer, any>;

  /**
   * Called by whatever is mounting the document renderer
   */

  start();

  /**
   * Pauses the renderer
   */

  stop();

  /**
   * Returns the bounding rects exactly as they're computed by the target renderer.
   */

  getBoundingRect(uid: string): BoundingRect;


  /**
   * Returns the bounding rects exactly as they're computed by the target renderer.
   */

  getAllBoundingRects(): BoundingRect[];

  /**
   * Resolves when the renderer is running
   */

  whenRunning(): Promise<any>;

  /**
   * Fetches and returns a computed style by the target rendering engine.
   */

  getComputedStyle(uid: string): any;

  /**
   */

  requestRender(): void;
}

// render timeout -- this should be a low number
const REQUEST_UPDATE_TIMEOUT = 5;

@loggable()
export abstract class BaseRenderer extends Observable implements ISyntheticDocumentRenderer {

  readonly element: HTMLElement;
  private _document: SyntheticDocument;
  private _rendering: boolean;
  public  $rects: any;

  @bindable()
  protected _rendered: boolean;

  @bindable()
  protected _running: boolean;

  readonly rectsWatcher: PropertyWatcher<BaseRenderer, any>;

  private _shouldRenderAgain: boolean;
  private _targetObserver: IBus<any, any>;
  private _computedStyles: any;
  private _currentRenderPromise: Promise<any>;

  protected readonly logger: Logger;
  readonly nodeFactory: Document;

  constructor(nodeFactory?: Document) {
    super();

    this.nodeFactory = nodeFactory || (typeof document !== "undefined" ? document : undefined);

    this._running = false;
    this._computedStyles = {};

    this.rectsWatcher = new PropertyWatcher<BaseRenderer, boolean>(this, "rects");

    // may be running in a worker. Do not create an element if that's the case.
    if (this.nodeFactory) {
      this.element = this.createElement();
    }

    this._targetObserver = new CallbackBus(this.onDocumentEvent.bind(this));
  }

  get rects(): any {
    return this.$rects;
  }

  get document(): SyntheticDocument {
    return this._document;
  }

  set document(value: SyntheticDocument) {
    if (this._document === value) {
      this.requestRender();
      return;
    }

    if (this._document) {
      this._document.unobserve(this._targetObserver);
    }
    this.reset();
    this._document = value;
    if (!this._document) return;
    this._document.observe(this._targetObserver);
    this.requestRender();
  }

  getAllBoundingRects() {
    return values(this.$rects) as BoundingRect[];
  }

  async whenRunning() {
    if (!this._running) await waitForPropertyChange(this, "_running", value => !!value);
  }

  async whenRendered() {
    if (!this._rendered) await waitForPropertyChange(this, "_rendered", value => !!value);
  }

  public start() {
    if (this._running) return;
    this._running = true;
    this.requestRender();
  }

  public stop() {
    this._running = false;
  }

  getComputedStyle(uid: string) {
    return this._computedStyles[uid];
  }

  getBoundingRect(uid: string) {
    return (this.$rects && this.$rects[uid]) || new BoundingRect(0, 0, 0, 0);
  }

  protected abstract render();

  protected reset() {

  }

  protected createElement() {
    return this.nodeFactory.createElement("div");
  }

  protected setRects(rects: { [IDentifier: string]: BoundingRect }, styles: { [IDentifier: string]: SyntheticCSSStyle }) {
    const oldRects = this.$rects;
    this.$rects          = rects;
    this._computedStyles = styles;
    this._rendered = true;
    this.notify(new PropertyMutation(PropertyMutation.PROPERTY_CHANGE, this, "rects", rects, oldRects).toEvent());

    // DEPRECATED
    this.notify(new SyntheticRendererEvent(SyntheticRendererEvent.UPDATE_RECTANGLES));
  }

  protected onDocumentEvent(event: CoreEvent) {
    if (this.element && (event.type === MutationEvent.MUTATION)) {
      this.onDocumentMutationEvent(<MutationEvent<any>>event);
    }
  }

  protected onDocumentMutationEvent(event: MutationEvent<any>) {
    this.requestRender();
  }

  public requestRender() {
    if (!this._document) return;

    if (this._currentRenderPromise) {
      this._shouldRenderAgain = true;
    }

    return this._currentRenderPromise || (this._currentRenderPromise = new Promise<any>((resolve, reject) => {

      const done = () => {
        this._currentRenderPromise = undefined;
      }

      // renderer here doesn't need to be particularly fast since the user
      // doesn't get to interact with visual content. Provide a slowish
      // timeout to ensure that we don't kill CPU from unecessary renders.
      const render = async () => {
        if (!this._document) return;
        await this.whenRunning();
        this._shouldRenderAgain = false;
        this.logger.debug("Rendering synthetic document");
        await this.render();
        if (this._shouldRenderAgain) {
          this._shouldRenderAgain = false;
          await render();
        }
      }

      setTimeout(() => {
        render().then(resolve, reject).then(done, done);
      }, this.getRequestUpdateTimeout());
    }));
  }

  protected getRequestUpdateTimeout() {

    // OVERRIDE ME - used for dynamic render throttling
    return REQUEST_UPDATE_TIMEOUT;
  }
}


export class BaseDecoratorRenderer extends Observable implements ISyntheticDocumentRenderer {
  constructor(protected _renderer: ISyntheticDocumentRenderer) {
    super();
    _renderer.observe(new CallbackBus(this.onTargetRendererEvent.bind(this)));
  }
  get rects() {
    return this._renderer.rects;
  }
  get rectsWatcher() {
    return this._renderer.rectsWatcher;
  }
  
  getComputedStyle(uid) {
    return this._renderer.getComputedStyle(uid);
  }
  getBoundingRect(uid) {
    return this._renderer.getBoundingRect(uid);
  }
  getAllBoundingRects() {
    return this._renderer.getAllBoundingRects();
  }
  whenRunning() {
    return this._renderer.whenRunning();
  }
  start() {
    this._renderer.start();
  }
  stop() {
    this._renderer.stop();
  }
  get element() {
    return this._renderer.element;
  }
  get document() {
    return this._renderer.document;
  }
  set document(value) {
    this._renderer.document = value;
  }

  requestRender() {
    return this._renderer.requestRender();
  }

  protected onTargetRendererEvent(message: CoreEvent) {
    if (message.type === SyntheticRendererEvent.UPDATE_RECTANGLES) {
      this.onTargetRendererSetRectangles();
    }
    // bubble up
    this.notify(message);
  }

  protected onTargetRendererSetRectangles() {

  }
}

export class NoopRenderer extends BaseRenderer implements ISyntheticDocumentRenderer {
  readonly element: HTMLElement;
  public document: SyntheticDocument;
  public getBoundingRect() {
    return BoundingRect.zeros();
  }
  get rects() {
    return {};
  }
  public getEagerComputedStyle() {
    return null;
  }
  getAllBoundingRects() {
    return [];
  }
  public whenRunning() {
    return Promise.resolve();
  }
  public start() { }
  public stop() { }
  public getComputedStyle() {
    return null;
  }
  public hasLoadedComputedStyle() {
    return false;
  }
  render() { }
  createElement() { return undefined; }
}