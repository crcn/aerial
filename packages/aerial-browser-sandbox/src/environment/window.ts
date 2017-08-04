import { Dispatcher, weakMemo } from "aerial-common2";
import { getSEnvLocationClass } from "./location";
import { getSEnvEventTargetClass } from "./events";
import { getSEnvHTMLElementClasses, getSEnvDocumentClass, getSEnvElementClass, getSEnvHTMLElementClass, SEnvDocumentAddon } from "./nodes";
import { getSEnvCustomElementRegistry } from "./custom-element-registry";

type OpenTarget = "_self" | "_blank";

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;


export const getSEnvWindowClass = weakMemo((context: any) => {

  const SEnvEventTarget = getSEnvEventTargetClass(context);
  const SEnvDocument = getSEnvDocumentClass(context);
  const SEnvLocation = getSEnvLocationClass(context);
  const SEnvCustomElementRegistry = getSEnvCustomElementRegistry(context);
  const SEnvElement     = getSEnvElementClass(context);
  const SEnvHTMLElement = getSEnvHTMLElementClass(context);

  // register default HTML tag names
  const TAG_NAME_MAP = getSEnvHTMLElementClasses(context);
  
  return class SEnvWindow extends SEnvEventTarget implements Window {

    readonly location: Location;

    readonly sessionStorage: Storage;
    readonly localStorage: Storage;
    readonly console: Console;
    readonly indexedDB: IDBFactory;
    readonly applicationCache: ApplicationCache;
    readonly caches: CacheStorage;
    readonly clientInformation: Navigator;
    readonly closed: boolean;
    readonly crypto: Crypto;
    defaultStatus: string;
    readonly devicePixelRatio: number;
    readonly document: SEnvDocumentAddon;
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
    readonly scrollX: number;
    readonly scrollY: number;
    readonly self: Window;
    readonly speechSynthesis: SpeechSynthesis;
    status: string;
    readonly statusbar: BarProp;
    readonly styleMedia: StyleMedia;
    readonly toolbar: BarProp;
    readonly top: Window;
    readonly window: Window;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
    Blob: typeof Blob;
    readonly customElements: CustomElementRegistry;

    // classes
    readonly EventTarget: typeof EventTarget = SEnvEventTarget;
    readonly Element: typeof Element = SEnvElement;
    readonly HTMLElement: typeof HTMLElement = SEnvHTMLElement;

    fetch: Fetch;
    
    constructor(readonly $$id: string, origin: string, readonly $$dispatch: Dispatcher<any>) {
      super();
      
      this.location = new SEnvLocation(origin);
      this.document = new SEnvDocument(this);
      this.window   = this;

      const customElements = this.customElements = new SEnvCustomElementRegistry(this);
      for (const tagName in TAG_NAME_MAP) {
        customElements.define(tagName, TAG_NAME_MAP[tagName]);
      }
    }

    alert(message?: any): void { }
    blur(): void { }
    cancelAnimationFrame(handle: number): void { }
    captureEvents(): void { }
    close(): void { }

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
    getComputedStyle(elt: Element, pseudoElt?: string): CSSStyleDeclaration {
      return null;
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

    }

    scroll(...args): void {

    }

    scrollBy(...args): void {

    }

    scrollTo(...args): void {

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
      const response = await this.fetch(this.location.origin);
      const content  = await response.text();
      this.document.$load(content);
    }
  }
});

export const openSyntheticEnvironmentWindow = (location: string, { fetch }: SyntheticWindowEnvironmentOptions) => {
  const SEnvWindow = getSEnvWindowClass({});
  const window = new SEnvWindow(null, location, null);
  window.fetch = fetch;
  window.$load();
  return window;
}