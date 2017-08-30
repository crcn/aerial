import { SyntheticWindow, createSyntheticWindow } from "../state";
import { getSEnvLocationClass } from "./location";
import { Dispatcher, weakMemo, Mutation, generateDefaultId, mergeBounds, Rectangle } from "aerial-common2";
import { clamp } from "lodash";
import { getSEnvEventTargetClass, getSEnvEventClasses, SEnvMutationEventInterface } from "./events";
import { SyntheticWindowRendererInterface, createNoopRenderer, SyntheticDOMRendererFactory, SyntheticWindowRendererEvent } from "./renderers";
import { getNodeByPath, getNodePath } from "../utils/node-utils"
import { 
  SEnvElementInterface,
  getSEnvHTMLElementClasses, 
  getSEnvDocumentClass, 
  getSEnvElementClass, 
  getSEnvHTMLElementClass, 
  SEnvDocumentInterface, 
  patchDocument, 
  patchParentNode, 
  patchValueNode, 
  diffDocument, 
  diffComment, 
  filterNodes,
  diffHTMLNode,
  patchHTMLNode,
  patchBaseElement
} from "./nodes";
import { getSEnvCustomElementRegistry } from "./custom-element-registry";
import nwmatcher = require("nwmatcher");
import { SEnvNodeTypes } from "./constants";

type OpenTarget = "_self" | "_blank";

export interface SEnvWindowInterface extends Window {
  uid: string;
  $id: string;
  fetch: Fetch;
  struct: SyntheticWindow;
  externalResourceUris: string[];
  document: SEnvDocumentInterface;
  readonly childObjects: Map<string, any>;
  renderer:  SyntheticWindowRendererInterface;
  $selector: any;
  clone(): SEnvWindowInterface;
};

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export type SEnvWindowContext = {
  fetch?: Fetch;
  reload?: () => {};
  proxyHost?: string;
  getRenderer?: (window: SEnvWindowInterface) => SyntheticWindowRendererInterface;
  console?: Console;
};


export const mirrorWindow = (target: SEnvWindowInterface, source: SEnvWindowInterface) => {
  const { SEnvMutationEvent, SEnvWindowOpenedEvent, SEnvURIChangedEvent } = getSEnvEventClasses();

  if (target.$id !== source.$id) {
    throw new Error(`target must be a previous clone of the source.`);
  }

  const sync = () => {
    patchWindow(target, diffWindow(target, source));
  };
  
  // happens with dynamic content.
  const onMutation = (event: SEnvMutationEventInterface) => {
    // element IDS do not line up properly, so we need to sync on each mutation
    sync();
  };

  const mirrorEvent = (event: Event) => {
    target.dispatchEvent(event);
  };

  const tryPatching = () => {
    if (source.document.readyState !== "complete") {
      return;
    }

    sync();
    source.addEventListener(SEnvMutationEvent.MUTATION, onMutation);
  };
  
  const onResize = (event: Event) => {
    target.resizeTo(source.innerWidth, source.innerHeight);
  };

  const onMove = (event: Event) => {
    target.moveTo(source.screenLeft, source.screenTop);
  };

  const onTargetMove = (event: Event) => {
    source.moveTo(target.screenLeft, target.screenTop);
  };

  const onTargetResize = (event: Event) => {
    source.resizeTo(target.innerWidth, target.innerHeight);
  };

  const onUriChanged = (event) => target.dispatchEvent(event);

  source.resizeTo(target.innerWidth, target.innerHeight);
  source.moveTo(target.screenLeft, target.screenTop);

  source.addEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, mirrorEvent);
  source.addEventListener("move", onMove);
  source.addEventListener("resize", onResize);
  source.addEventListener(SEnvURIChangedEvent.URI_CHANGED, onUriChanged);
  target.addEventListener("move", onTargetMove);
  target.addEventListener("resize", onTargetResize);
  source.document.addEventListener("readystatechange", tryPatching);

  tryPatching();

  return () => {
    source.removeEventListener(SEnvMutationEvent.MUTATION, onMutation);
    source.removeEventListener(SEnvWindowOpenedEvent.WINDOW_OPENED, mirrorEvent);
    source.removeEventListener(SEnvURIChangedEvent.URI_CHANGED, onUriChanged);
    source.removeEventListener("move", onMove);
    source.removeEventListener("resize", onResize);
    target.removeEventListener("move", onTargetMove);
    target.removeEventListener("resize", onTargetResize);
    target.removeEventListener("readystatechange", tryPatching);
  };
}
const defaultFetch = ((info) => {
  throw new Error(`Fetch not provided for ${info}`);
}) as any;

export const getSEnvWindowClass = weakMemo((context: SEnvWindowContext) => {
  const { getRenderer, fetch = defaultFetch } = context;


  const SEnvEventTarget = getSEnvEventTargetClass(context);
  const SEnvDocument = getSEnvDocumentClass(context);
  const SEnvLocation = getSEnvLocationClass(context);
  const SEnvCustomElementRegistry = getSEnvCustomElementRegistry(context);
  const SEnvElement     = getSEnvElementClass(context);
  const SEnvHTMLElement = getSEnvHTMLElementClass(context);
  const { SEnvEvent, SEnvMutationEvent, SEnvWindowOpenedEvent, SEnvURIChangedEvent } = getSEnvEventClasses(context);

  // register default HTML tag names
  const TAG_NAME_MAP = getSEnvHTMLElementClasses(context);

  const DEFAULT_WINDOW_WIDTH = 1366;
  const DEFAULT_WINDOW_HEIGHT = 768;

  return class SEnvWindow extends SEnvEventTarget implements SEnvWindowInterface {

    readonly location: Location;
    private _selector: any;
    private _renderer: SyntheticWindowRendererInterface;
    childObjects: Map<string, any>;

    readonly sessionStorage: Storage;
    readonly localStorage: Storage;
    readonly console: Console = context.console;
    readonly indexedDB: IDBFactory;
    readonly applicationCache: ApplicationCache;
    readonly caches: CacheStorage;
    readonly clientInformation: Navigator;
    readonly externalResourceUris: string[];
    uid: string;
    closed: boolean;
    readonly crypto: Crypto;
    defaultStatus: string;
    readonly devicePixelRatio: number;
    readonly document: SEnvDocumentInterface;
    readonly doNotTrack: string;
    event: Event | undefined;
    readonly URIChangedEvent: any;
    readonly external: External;
    readonly frameElement: Element;
    readonly frames: Window;
    readonly history: History;
    innerHeight: number;
    innerWidth: number;
    readonly isSecureContext: boolean;
    readonly length: number;
    readonly locationbar: BarProp;
    readonly menubar: BarProp;
    readonly msContentScript: ExtensionScriptApis;
    readonly msCredentials: MSCredentials;
    name: string;
    readonly navigator: Navigator;
    offscreenBuffering: string | boolean;
    onabort: (this: Window, ev: UIEvent) => any;
    onafterprint: (this: Window, ev: Event) => any;
    onbeforeprint: (this: Window, ev: Event) => any;
    onbeforeunload: (this: Window, ev: BeforeUnloadEvent) => any;
    onblur: (this: Window, ev: FocusEvent) => any;
    oncanplay: (this: Window, ev: Event) => any;
    oncanplaythrough: (this: Window, ev: Event) => any;
    onchange: (this: Window, ev: Event) => any;
    onclick: (this: Window, ev: MouseEvent) => any;
    oncompassneedscalibration: (this: Window, ev: Event) => any;
    oncontextmenu: (this: Window, ev: PointerEvent) => any;
    ondblclick: (this: Window, ev: MouseEvent) => any;
    ondevicelight: (this: Window, ev: DeviceLightEvent) => any;
    ondevicemotion: (this: Window, ev: DeviceMotionEvent) => any;
    ondeviceorientation: (this: Window, ev: DeviceOrientationEvent) => any;
    ondrag: (this: Window, ev: DragEvent) => any;
    ondragend: (this: Window, ev: DragEvent) => any;
    ondragenter: (this: Window, ev: DragEvent) => any;
    ondragleave: (this: Window, ev: DragEvent) => any;
    ondragover: (this: Window, ev: DragEvent) => any;
    ondragstart: (this: Window, ev: DragEvent) => any;
    ondrop: (this: Window, ev: DragEvent) => any;
    ondurationchange: (this: Window, ev: Event) => any;
    onemptied: (this: Window, ev: Event) => any;
    onended: (this: Window, ev: MediaStreamErrorEvent) => any;
    onerror: ErrorEventHandler;
    onfocus: (this: Window, ev: FocusEvent) => any;
    onhashchange: (this: Window, ev: HashChangeEvent) => any;
    oninput: (this: Window, ev: Event) => any;
    oninvalid: (this: Window, ev: Event) => any;
    onkeydown: (this: Window, ev: KeyboardEvent) => any;
    onkeypress: (this: Window, ev: KeyboardEvent) => any;
    onkeyup: (this: Window, ev: KeyboardEvent) => any;
    onload: (this: Window, ev: Event) => any;
    onloadeddata: (this: Window, ev: Event) => any;
    onloadedmetadata: (this: Window, ev: Event) => any;
    onloadstart: (this: Window, ev: Event) => any;
    onmessage: (this: Window, ev: MessageEvent) => any;
    onmousedown: (this: Window, ev: MouseEvent) => any;
    onmouseenter: (this: Window, ev: MouseEvent) => any;
    onmouseleave: (this: Window, ev: MouseEvent) => any;
    onmousemove: (this: Window, ev: MouseEvent) => any;
    onmouseout: (this: Window, ev: MouseEvent) => any;
    onmouseover: (this: Window, ev: MouseEvent) => any;
    onmouseup: (this: Window, ev: MouseEvent) => any;
    onmousewheel: (this: Window, ev: WheelEvent) => any;
    onmsgesturechange: (this: Window, ev: MSGestureEvent) => any;
    onmsgesturedoubletap: (this: Window, ev: MSGestureEvent) => any;
    onmsgestureend: (this: Window, ev: MSGestureEvent) => any;
    onmsgesturehold: (this: Window, ev: MSGestureEvent) => any;
    onmsgesturestart: (this: Window, ev: MSGestureEvent) => any;
    onmsgesturetap: (this: Window, ev: MSGestureEvent) => any;
    onmsinertiastart: (this: Window, ev: MSGestureEvent) => any;
    onmspointercancel: (this: Window, ev: MSPointerEvent) => any;
    onmspointerdown: (this: Window, ev: MSPointerEvent) => any;
    onmspointerenter: (this: Window, ev: MSPointerEvent) => any;
    onmspointerleave: (this: Window, ev: MSPointerEvent) => any;
    onmspointermove: (this: Window, ev: MSPointerEvent) => any;
    onmspointerout: (this: Window, ev: MSPointerEvent) => any;
    onmspointerover: (this: Window, ev: MSPointerEvent) => any;
    onmspointerup: (this: Window, ev: MSPointerEvent) => any;
    onoffline: (this: Window, ev: Event) => any;
    ononline: (this: Window, ev: Event) => any;
    onorientationchange: (this: Window, ev: Event) => any;
    onpagehide: (this: Window, ev: PageTransitionEvent) => any;
    onpageshow: (this: Window, ev: PageTransitionEvent) => any;
    onpause: (this: Window, ev: Event) => any;
    onplay: (this: Window, ev: Event) => any;
    onplaying: (this: Window, ev: Event) => any;
    onpopstate: (this: Window, ev: PopStateEvent) => any;
    onprogress: (this: Window, ev: ProgressEvent) => any;
    onratechange: (this: Window, ev: Event) => any;
    onreadystatechange: (this: Window, ev: ProgressEvent) => any;
    onreset: (this: Window, ev: Event) => any;
    onresize: (this: Window, ev: UIEvent) => any;
    onscroll: (this: Window, ev: UIEvent) => any;
    onseeked: (this: Window, ev: Event) => any;
    onseeking: (this: Window, ev: Event) => any;
    onselect: (this: Window, ev: UIEvent) => any;
    onstalled: (this: Window, ev: Event) => any;
    onstorage: (this: Window, ev: StorageEvent) => any;
    onsubmit: (this: Window, ev: Event) => any;
    onsuspend: (this: Window, ev: Event) => any;
    ontimeupdate: (this: Window, ev: Event) => any;
    ontouchcancel: (ev: TouchEvent) => any;
    ontouchend: (ev: TouchEvent) => any;
    ontouchmove: (ev: TouchEvent) => any;
    ontouchstart: (ev: TouchEvent) => any;
    onunload: (this: Window, ev: Event) => any;
    onvolumechange: (this: Window, ev: Event) => any;
    onwaiting: (this: Window, ev: Event) => any;
    onpointercancel: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerdown: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerenter: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerleave: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointermove: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerout: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerover: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerup: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onwheel: (this: GlobalEventHandlers, ev: WheelEvent) => any;
    opener: any;
    orientation: string | number;
    readonly outerHeight: number;
    readonly outerWidth: number;
    readonly pageXOffset: number;
    readonly pageYOffset: number;
    readonly parent: Window;
    readonly performance: Performance;
    readonly personalbar: BarProp;
    screen: Screen;
    screenLeft: number;
    screenTop: number;
    screenX: number;
    screenY: number;
    readonly scrollbars: BarProp;
    scrollX: number = 0;
    scrollY: number = 0;
    readonly self: Window;
    readonly speechSynthesis: SpeechSynthesis;
    status: string;
    readonly statusbar: BarProp;
    readonly CustomEvent: typeof Event = SEnvEvent as any as typeof Event;
    readonly styleMedia: StyleMedia;
    readonly toolbar: BarProp;
    readonly top: Window;
    readonly window: Window;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
    Blob: typeof Blob;
    readonly customElements: CustomElementRegistry;
    private _struct: SyntheticWindow;

    private _scrollRect: Rectangle = { width: Infinity, height: Infinity };

    // classes
    readonly EventTarget: typeof EventTarget = SEnvEventTarget;
    readonly Element: typeof Element = SEnvElement;
    readonly HTMLElement: typeof HTMLElement = SEnvHTMLElement;
    fetch: Fetch;
    private _childWindowCount: number = 0;
    public $id: string;
    
    constructor(origin: string) {
      super();

      this._onRendererPainted = this._onRendererPainted.bind(this);

      this.URIChangedEvent = SEnvURIChangedEvent;
      this.uid = this.$id = generateDefaultId();
      this.childObjects = new Map();
      this.location = new SEnvLocation(origin, context.reload);
      this.document = new SEnvDocument(this);
      this.window   = this;
      this.renderer = (getRenderer || createNoopRenderer)(this);
      this.innerWidth = DEFAULT_WINDOW_WIDTH;
      this.innerHeight = DEFAULT_WINDOW_HEIGHT;
      this.moveTo(0, 0);
      this.externalResourceUris = [];
      

      this.fetch = async (info) => {
        const ret = await fetch(info);
        this.externalResourceUris.push(info as string);
        return ret;
      }

      const customElements = this.customElements = new SEnvCustomElementRegistry(this);
      for (const tagName in TAG_NAME_MAP) {
        customElements.define(tagName, TAG_NAME_MAP[tagName]);
      }

      this.document.addEventListener(SEnvMutationEvent.MUTATION, this._onDocumentMutation.bind(this));
    }

    resetChildObjects() {
      this.childObjects = new Map();
      this.childObjects.set(this.document.$id, document);
      filterNodes(this.document, (child: Node) => {
        this.childObjects.set((child as any).$id, child);
        return false;
      });
    }

    get renderer() {
      return this._renderer;
    }

    set renderer(value: SyntheticWindowRendererInterface) {
      if (this._renderer) {
        this._renderer.removeEventListener(SyntheticWindowRendererEvent.PAINTED, this._onRendererPainted);
      }
      this._renderer = value;
      this._renderer.addEventListener(SyntheticWindowRendererEvent.PAINTED, this._onRendererPainted);
    }

    get struct() {
      if (!this._struct) {
        this._struct = createSyntheticWindow({
          $id: this.$id,
          location: this.location.toString(),
          document: this.document.struct,
          bounds: {
            left: this.screenLeft,
            top: this.screenTop,
            right: this.screenLeft + this.innerWidth,
            bottom: this.screenTop + this.innerHeight
          }
        });
      }
      return this._struct;
    }

    get $selector(): any {
      if (this._selector) return this._selector;
      
      this._selector = nwmatcher(this);

      // VERBOSITY = false to prevent breaking on invalid selector rules
      this._selector.configure({ CACHING: true, VERBOSITY: false });

      return this._selector;
    }

    alert(message?: any): void { }
    blur(): void { }
    cancelAnimationFrame(handle: number): void { }
    captureEvents(): void { }
    close(): void {
      this.closed = true;
    }

    confirm(message?: string): boolean {
      return false;
    }

    atob(encodedString: string): string {
      return null;
    }

    btoa(rawString: string): string {
      return null;
    }


    departFocus(navigationReason: NavigationReason, origin: FocusNavigationOrigin): void {
      
    }

    focus(): void {

    }
    getComputedStyle(elt: SEnvElementInterface, pseudoElt?: string): CSSStyleDeclaration {
      return this.renderer.getComputedStyle(elt);
    }

    getMatchedCSSRules(elt: Element, pseudoElt?: string): CSSRuleList {
      return null;
    }

    getSelection(): Selection {
      return null;
    }

    matchMedia(mediaQuery: string): MediaQueryList {
      return null;
    }

    clearInterval(handle: number): void {

    }

    clearTimeout(handle: number): void {

    }

    setInterval(handler, ms: number, ...args): number {
      return setInterval(handler, ms, ...args);
    }

    clone(deep?: boolean) {
      const window = new SEnvWindow(this.location.toString());
      window.$id = this.$id;
      if (deep !== false) {
        window.document.$$setID(this.document.$id);
        patchWindow(window, diffWindow(window, this));
      }
      return window;
    }


    setTimeout(...args): number {
      return 0;
    }

    clearImmediate(handle: number): void {

    }

    setImmediate(): number {
      return -1;
    }

    moveBy(x?: number, y?: number): void {

    }

    moveTo(x: number = this.screenLeft, y: number = this.screenTop): void {
      x = x && Math.round(x);
      y = y && Math.round(y);
      if (x === this.screenLeft && y === this.screenTop) {
        return;
      }
      this.screenLeft = this.screenY = x;
      this.screenTop  = this.screenX = y;
      const e = new SEnvEvent();
      e.initEvent("move", true, true);
      this.dispatchEvent(e);
    }

    msWriteProfilerMark(profilerMarkName: string): void {

    }

    open(url?: string, target?: string, features?: string, replace?: boolean): Window {

      const windowId = this.$id + "." + (++this._childWindowCount);

      const open = () => {

        const SEnvWindow = getSEnvWindowClass({ console, fetch, reload: open });
        
        const window = new SEnvWindow(url);
        window.$id = windowId;
        window.document.$id = window.$id + "-document";
        window.$load();
        const event = new SEnvWindowOpenedEvent();
        event.initWindowOpenedEvent(window);
        this.dispatchEvent(event);

        return window;
      };

      return open();
    }

    postMessage(message: any, targetOrigin: string, transfer?: any[]): void {

    }

    print(): void {

    }

    prompt(message?: string, _default?: string): string | null {
      return null;
    }

    releaseEvents(): void {

    }

    requestAnimationFrame(callback: FrameRequestCallback): number {
      return -1;
    }

    resizeBy(x?: number, y?: number): void {

    }

    resizeTo(x: number = this.innerWidth, y: number = this.innerHeight): void {
      x = x && Math.round(x);
      y = y && Math.round(y);
      if (x === this.innerWidth && y === this.innerHeight) {
        return;
      }
      this.innerWidth = x;
      this.innerHeight = y;
      const event = new SEnvEvent();
      event.initEvent("resize", true, true);
      this.dispatchEvent(event);
    }

    scroll(...args): void {
      this.scrollTo(...args);
    }

    scrollBy(...args): void {

    }

    scrollTo(...args): void {

      let left: number;
      let top: number;

      // scroll with options
      if (typeof args[0] === "object") {

      } else {
        [left, top] = args;
      }

      // TODO - use computed bounds here too
      left = clamp(left, 0, this._scrollRect.width);
      top  = clamp(top, 0, this._scrollRect.height);

      const oldScrollX = this.scrollX;
      const oldScrollY = this.scrollY;

      // no change
      if (oldScrollX === left && oldScrollY === top) {
        return;
      }
    

      this.scrollX = left;
      this.scrollY = top;
      
      const event = new SEnvEvent();
      event.initEvent("scroll", true, true);
      this.dispatchEvent(event);
    }

    stop(): void {

    }

    webkitCancelAnimationFrame(handle: number): void {

    }

    webkitConvertPointFromNodeToPage(node: Node, pt: WebKitPoint): WebKitPoint {
      return null;
    }

    webkitConvertPointFromPageToNode(node: Node, pt: WebKitPoint): WebKitPoint {
      return null;
    }

    webkitRequestAnimationFrame(callback: FrameRequestCallback): number {
      return -1;
    }

    createImageBitmap(...args) {
      return Promise.reject(null);
    }

    async $load() {
      const response = await this.fetch(this.location.toString());
      const content  = await response.text();
      this.document.$load(content);
    }

    private _onDocumentMutation(event: SEnvMutationEventInterface) {
      const eventClone = new SEnvMutationEvent();
      eventClone.initMutationEvent(event.mutation);
      this.dispatchEvent(eventClone);
    }

    protected _onRendererPainted(event: SyntheticWindowRendererEvent) {
      this._scrollRect = event.scrollRect;

      // sync scroll position that may have changed
      // during window resize, otherwise 
      this.scrollTo(event.scrollPosition.left, event.scrollPosition.top);
    }
  }
});

export const openSyntheticEnvironmentWindow = (location: string, context: SEnvWindowContext) => {
  const SEnvWindow = getSEnvWindowClass(context);
  const window = new SEnvWindow(location);
  window.$load();
  return window;
}

export const diffWindow = (oldWindow: SEnvWindowInterface, newWindow: SEnvWindowInterface) => { 
  return diffDocument(oldWindow.document, newWindow.document);
};

export const patchWindow = (oldWindow: SEnvWindowInterface, mutations: Mutation<any>[]) => {
  const { childObjects } = oldWindow;
  for (const mutation of mutations) {
    const target = childObjects.get(mutation.target.$id);
    if (target.nodeType != null) {
      patchNode(target, mutation);
    }
  }
}

export const patchNode = (node: Node, mutation: Mutation<any>) => {
  switch(node.nodeType) {
    case SEnvNodeTypes.TEXT:
    case SEnvNodeTypes.COMMENT: {
      patchValueNode(node as any, mutation);
      break;
    }
    case SEnvNodeTypes.ELEMENT: {
      patchHTMLNode(node as any, mutation);
      break;      
    }
    case SEnvNodeTypes.DOCUMENT: {
      patchDocument(node as SEnvDocumentInterface, mutation);
      break;
    }
  }
}
