import { SyntheticWindow, createSyntheticWindow } from "../state";
import { getSEnvLocationClass } from "./location";
import { Dispatcher, weakMemo, Mutation, generateDefaultId } from "aerial-common2";
import { getSEnvEventTargetClass, getSEnvEventClasses, SEnvMutationEventInterface } from "./events";
import { SyntheticWindowRenderer, createNoopRenderer, SyntheticDOMRendererFactory } from "./renderers";
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
  patchElement
} from "./nodes";
import { getSEnvCustomElementRegistry } from "./custom-element-registry";
import nwmatcher = require("nwmatcher");
import { SEnvNodeTypes } from "./constants";

type OpenTarget = "_self" | "_blank";

export interface SEnvWindowInterface extends Window {
  struct: SyntheticWindow;
  document: SEnvDocumentInterface;
  childObjects: Map<string, any>;
  renderer:  SyntheticWindowRenderer;
  selector: any
};

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export type SEnvWindowContext = {
  fetch: Fetch;
  proxyHost?: string;
  createRenderer?: SyntheticDOMRendererFactory;
  console?: Console;
};

export const getSEnvWindowClass = weakMemo((context: SEnvWindowContext) => {
  const { createRenderer, fetch } = context;

  const SEnvEventTarget = getSEnvEventTargetClass(context);
  const SEnvDocument = getSEnvDocumentClass(context);
  const SEnvLocation = getSEnvLocationClass(context);
  const SEnvCustomElementRegistry = getSEnvCustomElementRegistry(context);
  const SEnvElement     = getSEnvElementClass(context);
  const SEnvHTMLElement = getSEnvHTMLElementClass(context);
  const { SEnvEvent, SEnvMutationEvent } = getSEnvEventClasses(context);

  // register default HTML tag names
  const TAG_NAME_MAP = getSEnvHTMLElementClasses(context);
  
  return class SEnvWindow extends SEnvEventTarget implements SEnvWindowInterface {

    readonly location: Location;
    private _selector: any;
    readonly childObjects: Map<string, any>;

    readonly sessionStorage: Storage;
    readonly localStorage: Storage;
    readonly console: Console = context.console;
    readonly indexedDB: IDBFactory;
    readonly applicationCache: ApplicationCache;
    readonly caches: CacheStorage;
    readonly clientInformation: Navigator;
    readonly uid: string;
    closed: boolean;
    readonly crypto: Crypto;
    defaultStatus: string;
    readonly devicePixelRatio: number;
    readonly document: SEnvDocumentInterface;
    readonly doNotTrack: string;
    event: Event | undefined;
    readonly external: External;
    readonly frameElement: Element;
    readonly frames: Window;
    readonly history: History;
    readonly innerHeight: number;
    readonly innerWidth: number;
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
    readonly screen: Screen;
    readonly screenLeft: number;
    readonly screenTop: number;
    readonly screenX: number;
    readonly screenY: number;
    readonly scrollbars: BarProp;
    scrollX: number = 0;
    scrollY: number = 0;
    readonly self: Window;
    readonly speechSynthesis: SpeechSynthesis;
    status: string;
    readonly statusbar: BarProp;
    readonly styleMedia: StyleMedia;
    readonly toolbar: BarProp;
    readonly renderer: SyntheticWindowRenderer;
    readonly top: Window;
    readonly mount: HTMLElement;
    readonly window: Window;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
    Blob: typeof Blob;
    readonly customElements: CustomElementRegistry;
    private _struct: SyntheticWindow;

    // classes
    readonly EventTarget: typeof EventTarget = SEnvEventTarget;
    readonly Element: typeof Element = SEnvElement;
    readonly HTMLElement: typeof HTMLElement = SEnvHTMLElement;
    fetch: Fetch = fetch;
    
    constructor(readonly $$id: string, origin: string, readonly $$dispatch: Dispatcher<any>) {
      super();

      this.uid = generateDefaultId();
      this.childObjects = new Map();
      this.location = new SEnvLocation(origin);
      this.document = new SEnvDocument(this);
      this.window   = this;
      this.renderer = (createRenderer || createNoopRenderer)(this);

      const customElements = this.customElements = new SEnvCustomElementRegistry(this);
      for (const tagName in TAG_NAME_MAP) {
        customElements.define(tagName, TAG_NAME_MAP[tagName]);
      }

      this.document.addEventListener(SEnvMutationEvent.MUTATION, this._onDocumentMutation.bind(this));
    }

    get struct() {
      if (!this._struct) {
        this._struct = createSyntheticWindow({
          location: this.location.toString(),
          document: this.document.struct
        });
      }
      return this._struct;
    }

    get selector(): any {
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

    setInterval(...args): number {
      return 0;
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

    moveTo(x?: number, y?: number): void {

    }

    msWriteProfilerMark(profilerMarkName: string): void {

    }

    open(url?: string, target?: string, features?: string, replace?: boolean): Window {
      return null;
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

    resizeTo(x?: number, y?: number): void {
      const event = new SEnvEvent();
      event.initEvent("resize", true, true);
      this.dispatchEvent(event);
    }

    scroll(...args): void {

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
      left = Math.max(0, left);
      top  = Math.max(0, top);

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
  }
});

export const openSyntheticEnvironmentWindow = (location: string, context: SEnvWindowContext) => {
  const SEnvWindow = getSEnvWindowClass(context);
  const window = new SEnvWindow(null, location, null);
  window.$load();
  return window;
}

export const diffWindow = (oldWindow: SEnvWindowInterface, newWindow: SEnvWindowInterface) => { 
  return diffDocument(oldWindow.document, newWindow.document);
};

export const patchWindow = (oldWindow: SEnvWindowInterface, mutations: Mutation<any>[]) => {
  const { childObjects } = oldWindow;
  for (const mutation of mutations) {
    const target = childObjects.get(mutation.target.uid);
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
      patchElement(node as Element, mutation);
      break;      
    }
  }
}