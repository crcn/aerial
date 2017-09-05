import * as vm from "vm";
import { hasURIProtocol } from "aerial-sandbox2";
import { getSEnvEventClasses } from "../events";
import path = require("path");
import { getUri } from "../utils";
import { SEnvWindowInterface } from "../window";
import { getSEnvNodeClass, SEnvNodeInterface } from "./node";
import { SEnvNodeListInterface, getSEnvHTMLCollectionClasses } from "./collections";
import { getSEnvCSSStyleSheetClass, getSEnvCSSStyleDeclarationClass } from "../css";
import { weakMemo, SetValueMutation, createSetValueMutation, Mutation } from "aerial-common2";
import { getSEnvElementClass, SEnvElementInterface, diffBaseElement, patchBaseElement, diffBaseNode } from "./element";

export interface SEnvHTMLElementInterface extends HTMLElement, SEnvElementInterface {
  $$preconstruct();
  childNodes: SEnvNodeListInterface;
  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}

export interface SEnvHTMLStyledElementInterface extends SEnvHTMLElementInterface {
  $$setSheet(sheet: CSSStyleSheet);
}

export const getSEnvHTMLElementClass = weakMemo((context: any) => {
  const SEnvNode = getSEnvNodeClass(context);
  const SEnvElement = getSEnvElementClass(context);
  const SEnvCSSStyleDeclaration = getSEnvCSSStyleDeclarationClass(context);
  const { SEnvDOMStringMap } = getSEnvHTMLCollectionClasses(context);
  
  return class SEnvHTMLElement extends SEnvElement implements SEnvHTMLElementInterface {

    accessKey: string;
    contentEditable: string;
    private _dataset: DOMStringMap;
    dir: string;
    draggable: boolean;
    hidden: boolean;
    hideFocus: boolean;
    innerText: string;
    readonly isContentEditable: boolean;
    lang: string;
    readonly offsetHeight: number;
    readonly offsetLeft: number;
    readonly offsetParent: Element;
    readonly offsetTop: number;
    readonly offsetWidth: number;
    onabort: (this: HTMLElement, ev: UIEvent) => any;
    onactivate: (this: HTMLElement, ev: UIEvent) => any;
    onbeforeactivate: (this: HTMLElement, ev: UIEvent) => any;
    onbeforecopy: (this: HTMLElement, ev: ClipboardEvent) => any;
    onbeforecut: (this: HTMLElement, ev: ClipboardEvent) => any;
    onbeforedeactivate: (this: HTMLElement, ev: UIEvent) => any;
    onbeforepaste: (this: HTMLElement, ev: ClipboardEvent) => any;
    onblur: (this: HTMLElement, ev: FocusEvent) => any;
    oncanplay: (this: HTMLElement, ev: Event) => any;
    oncanplaythrough: (this: HTMLElement, ev: Event) => any;
    onchange: (this: HTMLElement, ev: Event) => any;
    onclick: (this: HTMLElement, ev: MouseEvent) => any;
    oncontextmenu: (this: HTMLElement, ev: PointerEvent) => any;
    oncopy: (this: HTMLElement, ev: ClipboardEvent) => any;
    oncuechange: (this: HTMLElement, ev: Event) => any;
    oncut: (this: HTMLElement, ev: ClipboardEvent) => any;
    ondblclick: (this: HTMLElement, ev: MouseEvent) => any;
    ondeactivate: (this: HTMLElement, ev: UIEvent) => any;
    ondrag: (this: HTMLElement, ev: DragEvent) => any;
    ondragend: (this: HTMLElement, ev: DragEvent) => any;
    ondragenter: (this: HTMLElement, ev: DragEvent) => any;
    ondragleave: (this: HTMLElement, ev: DragEvent) => any;
    ondragover: (this: HTMLElement, ev: DragEvent) => any;
    ondragstart: (this: HTMLElement, ev: DragEvent) => any;
    ondrop: (this: HTMLElement, ev: DragEvent) => any;
    ondurationchange: (this: HTMLElement, ev: Event) => any;
    onemptied: (this: HTMLElement, ev: Event) => any;
    onended: (this: HTMLElement, ev: MediaStreamErrorEvent) => any;
    onerror: (this: HTMLElement, ev: ErrorEvent) => any;
    onfocus: (this: HTMLElement, ev: FocusEvent) => any;
    oninput: (this: HTMLElement, ev: Event) => any;
    oninvalid: (this: HTMLElement, ev: Event) => any;
    onkeydown: (this: HTMLElement, ev: KeyboardEvent) => any;
    onkeypress: (this: HTMLElement, ev: KeyboardEvent) => any;
    onkeyup: (this: HTMLElement, ev: KeyboardEvent) => any;
    onload: (this: HTMLElement, ev: Event) => any;
    onloadeddata: (this: HTMLElement, ev: Event) => any;
    onloadedmetadata: (this: HTMLElement, ev: Event) => any;
    onloadstart: (this: HTMLElement, ev: Event) => any;
    onmousedown: (this: HTMLElement, ev: MouseEvent) => any;
    onmouseenter: (this: HTMLElement, ev: MouseEvent) => any;
    onmouseleave: (this: HTMLElement, ev: MouseEvent) => any;
    onmousemove: (this: HTMLElement, ev: MouseEvent) => any;
    onmouseout: (this: HTMLElement, ev: MouseEvent) => any;
    onmouseover: (this: HTMLElement, ev: MouseEvent) => any;
    onmouseup: (this: HTMLElement, ev: MouseEvent) => any;
    onmousewheel: (this: HTMLElement, ev: WheelEvent) => any;
    onmscontentzoom: (this: HTMLElement, ev: UIEvent) => any;
    onmsmanipulationstatechanged: (this: HTMLElement, ev: MSManipulationEvent) => any;
    onpaste: (this: HTMLElement, ev: ClipboardEvent) => any;
    onpause: (this: HTMLElement, ev: Event) => any;
    onplay: (this: HTMLElement, ev: Event) => any;
    onplaying: (this: HTMLElement, ev: Event) => any;
    onprogress: (this: HTMLElement, ev: ProgressEvent) => any;
    onratechange: (this: HTMLElement, ev: Event) => any;
    onreset: (this: HTMLElement, ev: Event) => any;
    onscroll: (this: HTMLElement, ev: UIEvent) => any;
    onseeked: (this: HTMLElement, ev: Event) => any;
    onseeking: (this: HTMLElement, ev: Event) => any;
    onselect: (this: HTMLElement, ev: UIEvent) => any;
    onselectstart: (this: HTMLElement, ev: Event) => any;
    onstalled: (this: HTMLElement, ev: Event) => any;
    onsubmit: (this: HTMLElement, ev: Event) => any;
    onsuspend: (this: HTMLElement, ev: Event) => any;
    ontimeupdate: (this: HTMLElement, ev: Event) => any;
    onvolumechange: (this: HTMLElement, ev: Event) => any;
    onwaiting: (this: HTMLElement, ev: Event) => any;
    outerText: string;
    spellcheck: boolean;
    private _style: CSSStyleDeclaration;
    private _styleProxy: CSSStyleDeclaration;
    tabIndex: number;
    title: string;

    protected _linkChild(child: SEnvNodeInterface) {
      super._linkChild(child);
      child.$$parentElement = this;
      
    }

    get style(): CSSStyleDeclaration {
      return this._styleProxy || this._resetStyleProxy();
    }

    get dataset(): DOMStringMap {
      return this._dataset || (this._dataset = new Proxy(new SEnvDOMStringMap(), {
        get(target, key) {
          return target[key];
        },
        set: (target, key: string, value: string, handler) => {
          const attrName = key.toLowerCase();
          this.dataChangedCallback(attrName, target[attrName], value);
          target[attrName] = value;
          return true;
        }
      }))
    }

    protected attributeChangedCallback(propertyName: string, oldValue: string, newValue: string) {
      super.attributeChangedCallback(propertyName, oldValue, newValue);
      if (propertyName === "style" && newValue !== this._getStyleString()) {
        this.style.cssText = newValue || "";
      } else if (propertyName.substr(0, 5) === "data-") {
        this.dataset[propertyName.substr(5).toLowerCase()] = newValue;
      } 
    }

    protected dataChangedCallback(propertyName: string, oldValue: string, newValue: string) {
      if (propertyName === "_source") {
        const source = JSON.parse(newValue);

        // transform uri in case it needs to go through a proxy
        source.uri = (this.ownerDocument.defaultView as SEnvWindowInterface).getSourceUri(source.uri);

        this.source = source;
      }
    }

    set style(value: CSSStyleDeclaration) {
      Object.assign(this.style, value);
      this.onStyleChange();
    }

    blur(): void {

    }

    click(): void {

    }

    dragDrop(): boolean {
      return null;
    }

    focus(): void {
      return null;
    }

    msGetInputContext(): MSInputMethodContext {
      return null;
    }

    remove(): void {
      
    }

    private _resetStyleProxy() {

      if (!this._style) {
        this._style = new SEnvCSSStyleDeclaration();
      }

      // Proxy the style here so that any changes get synchronized back
      // to the attribute
      // element.
      return this._styleProxy = new Proxy(this._style, {
        get: (target, propertyName, receiver) => {
          return target[propertyName];
        },
        set: (target, propertyName, value, receiver) => {

          // normalize the value if it's a pixel unit. Numbers are invalid for CSS declarations.
          if (typeof value === "number") {
            value = Math.round(value) + "px";
          }

          target.setProperty(propertyName.toString(), value);
          this.onStyleChange();
          return true;
        }
      });
    }

    protected onStyleChange() {
      this.setAttribute("style", this._getStyleString());
    }

    private _getStyleString() {
      return this.style.cssText.replace(/[\n\t\s]+/g, " ").trim();
    }
  }
});

export const getSEnvHTMLStyleElementClass = weakMemo((context: any) => {
  const SEnvHTMLElement = getSEnvHTMLElementClass(context);
  const SEnvCSSStyleSheet = getSEnvCSSStyleSheetClass(context);
  const { SEnvEvent } = getSEnvEventClasses(context);

  return class SEnvHTMLStyleElement extends SEnvHTMLElement implements HTMLStyleElement, SEnvHTMLStyledElementInterface { 
    sheet: CSSStyleSheet;
    disabled: boolean;
    media: string;
    type: string;

    initialize() {
      this._load();
    }

    private _load() {
      this.sheet = new SEnvCSSStyleSheet();
      const source = this.textContent;
      this.sheet.cssText = source;
      const e = new SEnvEvent();
      e.initEvent("load", true, true);
      this.dispatchEvent(e);
    }

    $$setSheet(sheet: CSSStyleSheet) {
      this.sheet = sheet;
    }

    cloneShallow() {
      const clone = super.cloneShallow();
      const styleSheet = new SEnvCSSStyleSheet();
      styleSheet.cssText = this.sheet.cssText;
      (clone as SEnvHTMLStyledElementInterface).$$setSheet(styleSheet);
      return clone;
    }
  };
});

export const diffHTMLStyleElement = (oldElement: HTMLStyledElement, newElement: HTMLStyledElement) => diffHTMLStyledElement(oldElement, newElement);

export const patchHTMLStyleElement = (oldElement: HTMLStyledElement, mutation: Mutation<any>) => patchHTMLStyledElement(oldElement, mutation);

export const getSEnvHTMLLinkElementClass = weakMemo((context: any) => {
  const SEnvHTMLElement = getSEnvHTMLElementClass(context);
  const SEnvCSSStyleSheet = getSEnvCSSStyleSheetClass(context);
  const { SEnvEvent } = getSEnvEventClasses(context);

  return class SEnvHTMLLinkElement extends SEnvHTMLElement implements HTMLLinkElement, SEnvHTMLStyledElementInterface {

    sheet: StyleSheet;
    disabled: boolean;
    hreflang: string;
    media: string;
    rev: string;
    target: string;
    type: string;
    import?: Document;
    integrity: string;
    private _resolveLoaded: (value?) => any;
    private _rejectLoaded: (value?) => any;

    initialize() {
      super.initialize();
      this.interactiveLoaded = new Promise((resolve, reject) => {
        this._resolveLoaded = resolve;
        this._rejectLoaded  = reject;
      });
      this._load();
    }

    get rel() {
      return this.getAttribute("rel");
    }

    get charset() {
      return this.getAttribute("charset");
    }

    set charset(value: string) {
      this.setAttribute("charset", value);
    }

    set rel(value: string) {
      this.setAttribute("rel", value);
      this._load();
    }
    
    get href() {
      return this.getAttribute("href");
    }

    set href(value: string) {
      this.setAttribute("href", value);
      this._load();
    }

    private _load() {
      const { rel } = this;
      if (rel === "stylesheet") {
        return this._loadStylesheet();
      }

      this._resolveLoaded();
    }

    $$setSheet(sheet: CSSStyleSheet) {
      this.sheet = sheet;
    }

    cloneShallow() {
      const clone = super.cloneShallow() as any as HTMLLinkElement;
      if (this.sheet) {

        // TODO: clean this up -- clone stylesheet instead of using
        // cssText which will run the parser again (we don't want that because it's sloowwwwwww). (CC)
        const sheet = new SEnvCSSStyleSheet();
        sheet.cssText = (this.sheet as CSSStyleSheet).cssText;
        (clone as any as SEnvHTMLStyledElementInterface).$$setSheet(sheet);
      }
      return clone as any;
    }
    
    private async _loadStylesheet() {
      try {
        const { href } = this;
        const window = this.ownerDocument.defaultView;
        const uri = getUri(href, String(window.location));
        const response = await window.fetch(uri);
        const text = await response.text();

        this._parseStylesheet(text);
        const event = new SEnvEvent();
        event.initEvent("load", true, true);
        this._resolveLoaded();
        this.dispatchEvent(event);
      } catch(e) {
        this._rejectLoaded(e);
      }
    }

    private _parseStylesheet(text: string) {
      const sheet = this.sheet = new SEnvCSSStyleSheet();
      const location = this.ownerDocument.defaultView.location;
      sheet.cssText = text.replace(/url\(.*?\)/g, (url) => {
        const url2 = url.replace(/(^url\(["']?)/g, "").replace(/(['"]?\)$)/, "");
        return `url(${getUri(url2, String(location))})`;
      });
    }
  };
});

export type HTMLStyledElement = HTMLLinkElement|HTMLStyleElement;

export const SET_STYLED_ELEMENT_SHEET = "SET_STYLED_ELEMENT_SHEET";

export const setStyledElementSheetMutation = (target: HTMLStyledElement, sheet: CSSStyleSheet) => createSetValueMutation(SET_STYLED_ELEMENT_SHEET, target, sheet);

export const diffHTMLStyledElement = (oldElement: HTMLStyledElement, newElement: HTMLStyledElement) => {

  const mutations = [];

  // TODO - patch here instead
  if ((oldElement.sheet as CSSStyleSheet).cssText !== (newElement.sheet as CSSStyleSheet).cssText) {
    mutations.push(setStyledElementSheetMutation(oldElement, (newElement.sheet as CSSStyleSheet)));
  }

  return [
    ...mutations,
    ...diffBaseElement(oldElement, newElement)
  ]
}

export const patchHTMLStyledElement = (oldElement: HTMLStyledElement, mutation: Mutation<any>) => {
  switch(mutation.$type) {
    case SET_STYLED_ELEMENT_SHEET: {

    }
  }
}


export const diffHTMLLinkElement = (oldElement: HTMLLinkElement, newElement: HTMLLinkElement) => {
  if (oldElement.rel === "stylesheet") {
    return diffHTMLStyledElement(oldElement, newElement);
  } else {
    return diffBaseElement(oldElement, newElement);
  }
}

export const patchHTMLLinkElement = (oldElement: HTMLLinkElement, mutation: Mutation<any>) => patchHTMLStyledElement(oldElement, mutation);

const _scriptCache = {};

const compileScript = (source) => _scriptCache[source] || (_scriptCache[source] = new Function("__context", `with(__context) {\n${source}\n}`));

const declarePropertiesFromScript = <T extends any>(context: T, script): T => {

  // TODO - need to use acorn to figure out where all global vars are
  return context;
}

export const getSenvHTMLScriptElementClass = weakMemo((context: any) => {
  const SEnvHTMLElement = getSEnvHTMLElementClass(context);
  return class SEnvHTMLScriptElement extends SEnvHTMLElement implements HTMLScriptElement { async: boolean;
      charset: string;
      crossOrigin: string | null;
      defer: boolean;
      event: string;
      htmlFor: string;
      text: string;
      type: string;
      integrity: string;

      private _scriptSource: string;
      private _filename: string;
      private _resolveContentLoaded: () => any;
      private _rejectContentLoaded: () => any;

      get src() {
        return this.getAttribute("src");
      }

      initialize() {
        super.initialize();
        this._load();
      }

      private async _load() {
        const { src } = this;
        if (src) {
          const window = this.ownerDocument.defaultView;
          this.contentLoaded = new Promise((resolve, reject) => {
            this._resolveContentLoaded = resolve;
            this._rejectContentLoaded = reject;
          });

          const response = await window.fetch(getUri(src, String(window.location)));
          const text = await response.text();

          this._scriptSource = text;
          this._filename = src;
          this._evaluate();
        } else {
          this._resolveContentLoaded = () => {};
          this._rejectContentLoaded = () => {};
          this._scriptSource = this.textContent;
          this._filename = this.ownerDocument.defaultView.location.toString();
          this._evaluate();
        }
      }

      private _evaluate() {
        try {
          const run = compileScript(this._scriptSource);

          run.call(this.ownerDocument.defaultView, (declarePropertiesFromScript(this.ownerDocument.defaultView, this._scriptSource)));
          // TODO - need to grab existing VM object
          // script.runInNewContext(vm.createContext({ __context: this.ownerDocument.defaultView }));
          
        } catch(e) {
          this.ownerDocument.defaultView.console.warn(e);
        }

        // temp for now. Needs to call reject if error is caught
        this._resolveContentLoaded();
      }
    }
}); 


export const getSEnvHTMLElementClasses = weakMemo((context: any) => {
  const SEnvHTMLElement = getSEnvHTMLElementClass(context);

  /*

  1.

  pbpaste | node -e "\
    const buffer = [];\
    process.stdin.resume();\
    process.stdin.setEncoding('utf8');\
    process.stdin.on('data', (chunk) => {\
      buffer.push(chunk);\
    });\
    process.stdin.on('end', (chunk) => {\
      transform(buffer.join(''));\
    });\
    const transform = (content) => {\
      content.match(/HTMLElementTagNameMap\s\{([\s\S\n]*?)\}/)[1].match(/\"(\w+)\":\s(\w+)/g).forEach((m) => {\
            const [match, name, className] = m.match(/\"(\w+)\":\s(\w+)/);\
            console.log(\`    \"\${name}\": class SEnv\${className} extends SEnvHTMLElement implements \${className} { },\`);\
      });\
    };\
    " | pbcopy

  2. copy lib.dom.d.ts
  3. run #1
  4. paste here
  5. fix interface issues
  5. cast returned value as ElementTagNameMap

  */

  return {
    // TODO - move to separate function
    "a": class SEnvHTMLAnchorElement extends SEnvHTMLElement implements HTMLAnchorElement {
      charset: string;
      coords: string;
      download: string;
      hash: string;
      host: string;
      hostname: string;
      href: string;
      hreflang: string;
      Methods: string;
      readonly mimeType: string;
      name: string;
      readonly nameProp: string;
      pathname: string;
      port: string;
      protocol: string;
      readonly protocolLong: string;
      rel: string;
      rev: string;
      search: string;
      shape: string;
      target: string;
      text: string;
      type: string;
      urn: string;
    },
    "applet": class SEnvHTMLAppletElement extends SEnvHTMLElement implements HTMLAppletElement {
      align: string;
      alt: string;
      altHtml: string;
      archive: string;
      readonly BaseHref: string;
      border: string;
      code: string;
      codeBase: string;
      codeType: string;
      readonly contentDocument: Document;
      data: string;
      declare: boolean;
      readonly form: HTMLFormElement;
      height: string;
      hspace: number;
      name: string;
      object: string | null;
      standby: string;
      type: string;
      useMap: string;
      vspace: number;
      width: number;
    },
    "area": class SEnvHTMLAreaElement extends SEnvHTMLElement implements HTMLAreaElement {
      alt: string;
      coords: string;
      download: string;
      hash: string;
      host: string;
      hostname: string;
      href: string;
      noHref: boolean;
      pathname: string;
      port: string;
      protocol: string;
      rel: string;
      search: string;
      shape: string;
      target: string;
    },
    "audio": class SEnvHTMLAudioElement extends SEnvHTMLElement implements HTMLAudioElement {

      readonly audioTracks: AudioTrackList;
      autoplay: boolean;
      readonly buffered: TimeRanges;
      controls: boolean;
      crossOrigin: string | null;
      readonly currentSrc: string;
      currentTime: number;
      defaultMuted: boolean;
      defaultPlaybackRate: number;
      readonly duration: number;
      readonly ended: boolean;
      readonly error: MediaError;
      loop: boolean;
      readonly mediaKeys: MediaKeys | null;
      msAudioCategory: string;
      msAudioDeviceType: string;
      readonly msGraphicsTrustStatus: MSGraphicsTrust;
      readonly msKeys: MSMediaKeys;
      msPlayToDisabled: boolean;
      msPlayToPreferredSourceUri: string;
      msPlayToPrimary: boolean;
      readonly msPlayToSource: any;
      msRealTime: boolean;
      muted: boolean;
      readonly networkState: number;
      onencrypted: (this: HTMLMediaElement, ev: MediaEncryptedEvent) => any;
      onmsneedkey: (this: HTMLMediaElement, ev: MSMediaKeyNeededEvent) => any;
      readonly paused: boolean;
      playbackRate: number;
      readonly played: TimeRanges;
      preload: string;
      readyState: number;
      readonly seekable: TimeRanges;
      readonly seeking: boolean;
      src: string;
      srcObject: MediaStream | null;
      readonly textTracks: TextTrackList;
      readonly videoTracks: VideoTrackList;
      volume: number;
      addTextTrack(kind: string, label?: string, language?: string): TextTrack {
        return null;
      }
      canPlayType(type: string): string {
        return null;
      }
      load(): void {

      }
      msClearEffects(): void {

      }
      msGetAsCastingSource(): any {

      }
      msInsertAudioEffect(activatableClassId: string, effectRequired: boolean, config?: any): void {

      }
      msSetMediaKeys(mediaKeys: MSMediaKeys): void {

      }
      msSetMediaProtectionManager(mediaProtectionManager?: any): void {

      }
      pause(): void {

      }
      play(): Promise<void> {
        return null;
      }
      setMediaKeys(mediaKeys: MediaKeys | null): Promise<void> {
        return null;
      }
      readonly HAVE_CURRENT_DATA: number;
      readonly HAVE_ENOUGH_DATA: number;
      readonly HAVE_FUTURE_DATA: number;
      readonly HAVE_METADATA: number;
      readonly HAVE_NOTHING: number;
      readonly NETWORK_EMPTY: number;
      readonly NETWORK_IDLE: number;
      readonly NETWORK_LOADING: number;
      readonly NETWORK_NO_SOURCE: number;
    },
    "base": class SEnvHTMLBaseElement extends SEnvHTMLElement implements HTMLBaseElement {
      href: string;
      target: string;
    },
    "basefont": class SEnvHTMLBaseFontElement extends SEnvHTMLElement implements HTMLBaseFontElement {
      color: string;
      face: string;
      size: number;
    },
    "blockquote": class SEnvHTMLQuoteElement extends SEnvHTMLElement implements HTMLQuoteElement {
      cite: string;
    },
    "body": class SEnvHTMLBodyElement extends SEnvHTMLElement implements HTMLBodyElement {
      aLink: any;
      background: string;
      bgColor: any;
      bgProperties: string;
      link: any;
      noWrap: boolean;
      onafterprint: (this: HTMLBodyElement, ev: Event) => any;
      onbeforeprint: (this: HTMLBodyElement, ev: Event) => any;
      onbeforeunload: (this: HTMLBodyElement, ev: BeforeUnloadEvent) => any;
      onblur: (this: HTMLBodyElement, ev: FocusEvent) => any;
      onerror: (this: HTMLBodyElement, ev: ErrorEvent) => any;
      onfocus: (this: HTMLBodyElement, ev: FocusEvent) => any;
      onhashchange: (this: HTMLBodyElement, ev: HashChangeEvent) => any;
      onload: (this: HTMLBodyElement, ev: Event) => any;
      onmessage: (this: HTMLBodyElement, ev: MessageEvent) => any;
      onoffline: (this: HTMLBodyElement, ev: Event) => any;
      ononline: (this: HTMLBodyElement, ev: Event) => any;
      onorientationchange: (this: HTMLBodyElement, ev: Event) => any;
      onpagehide: (this: HTMLBodyElement, ev: PageTransitionEvent) => any;
      onpageshow: (this: HTMLBodyElement, ev: PageTransitionEvent) => any;
      onpopstate: (this: HTMLBodyElement, ev: PopStateEvent) => any;
      onresize: (this: HTMLBodyElement, ev: UIEvent) => any;
      onscroll: (this: HTMLBodyElement, ev: UIEvent) => any;
      onstorage: (this: HTMLBodyElement, ev: StorageEvent) => any;
      onunload: (this: HTMLBodyElement, ev: Event) => any;
      text: any;
      vLink: any;
    },
    "br": class SEnvHTMLBRElement extends SEnvHTMLElement implements HTMLBRElement {
      clear: string;
    },
    "button": class SEnvHTMLButtonElement extends SEnvHTMLElement implements HTMLButtonElement {

      autofocus: boolean;
      disabled: boolean;
      readonly form: HTMLFormElement;
      formAction: string;
      formEnctype: string;
      formMethod: string;
      formNoValidate: string;
      formTarget: string;
      name: string;
      status: any;
      type: string;
      readonly validationMessage: string;
      readonly validity: ValidityState;
      value: string;
      readonly willValidate: boolean;
      checkValidity(): boolean {
        return null;
      }
      setCustomValidity(error: string): void {

      }
    },
    "canvas": class SEnvHTMLCanvasElement extends SEnvHTMLElement implements HTMLCanvasElement {
      height: number;
      width: number;
      getContext(contextId: "2d", contextAttributes?: Canvas2DContextAttributes): CanvasRenderingContext2D | null;
      getContext(contextId: "webgl" | "experimental-webgl", contextAttributes?: WebGLContextAttributes): WebGLRenderingContext | null;
      getContext(contextId: string, contextAttributes?: {}): CanvasRenderingContext2D | WebGLRenderingContext | null {
        return null;
      }
      msToBlob(): Blob {
        return null;
      }
      toDataURL(type?: string, ...args: any[]): string {
        return null;
      }
      toBlob(callback: (result: Blob | null) => void, type?: string, ...args): void {

      }
    },
    "caption": class SEnvHTMLTableCaptionElement extends SEnvHTMLElement implements HTMLTableCaptionElement {
      align: string;
      vAlign: string;
    },
    "col": class SEnvHTMLTableColElement extends SEnvHTMLElement implements HTMLTableColElement {
      align: string;
      span: number;
      width: any;
      ch: string;
      chOff: string;
      vAlign: string;
    },
    "colgroup": class SEnvHTMLTableColElement extends SEnvHTMLElement implements HTMLTableColElement {
      align: string;
      span: number;
      width: any;
      ch: string;
      chOff: string;
      vAlign: string;
    },
    "data": class SEnvHTMLDataElement extends SEnvHTMLElement implements HTMLDataElement {
      value: string;
    },
    "datalist": class SEnvHTMLDataListElement extends SEnvHTMLElement implements HTMLDataListElement {
      options: HTMLCollectionOf<HTMLOptionElement>;
    },
    "del": class SEnvHTMLModElement extends SEnvHTMLElement implements HTMLModElement {
      cite: string;
      dateTime: string;
    },
    "dir": class SEnvHTMLDirectoryElement extends SEnvHTMLElement implements HTMLDirectoryElement {
      compact: boolean;
    },
    "div": class SEnvHTMLDivElement extends SEnvHTMLElement implements HTMLDivElement {
      align: string;
      noWrap: boolean;
    },
    "dl": class SEnvHTMLDListElement extends SEnvHTMLElement implements HTMLDListElement { 
      compact: boolean;
    },
    "embed": class SEnvHTMLEmbedElement extends SEnvHTMLElement implements HTMLEmbedElement {
      height: string;
      hidden: any;
      msPlayToDisabled: boolean;
      msPlayToPreferredSourceUri: string;
      msPlayToPrimary: boolean;
      readonly msPlayToSource: any;
      name: string;
      readonly palette: string;
      readonly pluginspage: string;
      readonly readyState: string;
      src: string;
      units: string;
      width: string;
      getSVGDocument(): Document {
        return null;
      }
    },
    "fieldset": class SEnvHTMLFieldSetElement extends SEnvHTMLElement implements HTMLFieldSetElement {
      align: string;
      disabled: boolean;
      readonly form: HTMLFormElement;
      name: string;
      readonly validationMessage: string;
      readonly validity: ValidityState;
      readonly willValidate: boolean;
      checkValidity(): boolean {
        return false;
      }
      setCustomValidity(error: string): void { }
    },
    "font": class SEnvHTMLFontElement extends SEnvHTMLElement implements HTMLFontElement { 
      color: string;
      size: number;
      face: string;
    },
    "form": class SEnvHTMLFormElement extends SEnvHTMLElement implements HTMLFormElement { 
      acceptCharset: string;
      action: string;
      autocomplete: string;
      readonly elements: HTMLFormControlsCollection;
      encoding: string;
      enctype: string;
      readonly length: number;
      method: string;
      name: string;
      noValidate: boolean;
      target: string;
      checkValidity(): boolean {
        return false;
      }
      item(name?: any, index?: any): any { }
      namedItem(name: string): any { }
      reset(): void { }
      submit(): void { }
    },
    "frame": class SEnvHTMLFrameElement extends SEnvHTMLElement implements HTMLFrameElement { 
      border: string;
      borderColor: any;
      readonly contentDocument: Document;
      readonly contentWindow: Window;
      frameBorder: string;
      frameSpacing: any;
      height: string | number;
      longDesc: string;
      marginHeight: string;
      marginWidth: string;
      name: string;
      noResize: boolean;
      onload: (this: HTMLFrameElement, ev: Event) => any;
      scrolling: string;
      src: string;
      width: string | number;
      getSVGDocument(): Document {
        return null;
      }
    },
    "frameset": class SEnvHTMLFrameSetElement extends SEnvHTMLElement implements HTMLFrameSetElement {
      border: string;
      borderColor: any;
      cols: string;
      frameBorder: string;
      frameSpacing: any;
      name: string;
      onafterprint: (this: HTMLFrameSetElement, ev: Event) => any;
      onbeforeprint: (this: HTMLFrameSetElement, ev: Event) => any;
      onbeforeunload: (this: HTMLFrameSetElement, ev: BeforeUnloadEvent) => any;
      onblur: (this: HTMLFrameSetElement, ev: FocusEvent) => any;
      onerror: (this: HTMLFrameSetElement, ev: ErrorEvent) => any;
      onfocus: (this: HTMLFrameSetElement, ev: FocusEvent) => any;
      onhashchange: (this: HTMLFrameSetElement, ev: HashChangeEvent) => any;
      onload: (this: HTMLFrameSetElement, ev: Event) => any;
      onmessage: (this: HTMLFrameSetElement, ev: MessageEvent) => any;
      onoffline: (this: HTMLFrameSetElement, ev: Event) => any;
      ononline: (this: HTMLFrameSetElement, ev: Event) => any;
      onorientationchange: (this: HTMLFrameSetElement, ev: Event) => any;
      onpagehide: (this: HTMLFrameSetElement, ev: PageTransitionEvent) => any;
      onpageshow: (this: HTMLFrameSetElement, ev: PageTransitionEvent) => any;
      onpopstate: (this: HTMLFrameSetElement, ev: PopStateEvent) => any;
      onresize: (this: HTMLFrameSetElement, ev: UIEvent) => any;
      onscroll: (this: HTMLFrameSetElement, ev: UIEvent) => any;
      onstorage: (this: HTMLFrameSetElement, ev: StorageEvent) => any;
      onunload: (this: HTMLFrameSetElement, ev: Event) => any;
      rows: string;
    },
    "h1": class SEnvHTMLHeadingElement extends SEnvHTMLElement implements HTMLHeadingElement { 
      align: string;
    },
    "h2": class SEnvHTMLHeadingElement extends SEnvHTMLElement implements HTMLHeadingElement { 
      align: string;
    },
    "h3": class SEnvHTMLHeadingElement extends SEnvHTMLElement implements HTMLHeadingElement { 
      align: string;
    },
    "h4": class SEnvHTMLHeadingElement extends SEnvHTMLElement implements HTMLHeadingElement { 
      align: string;
    },
    "h5": class SEnvHTMLHeadingElement extends SEnvHTMLElement implements HTMLHeadingElement { 
      align: string;
    },
    "h6": class SEnvHTMLHeadingElement extends SEnvHTMLElement implements HTMLHeadingElement {

      align: string;
    },
    "head": class SEnvHTMLHeadElement extends SEnvHTMLElement implements HTMLHeadElement { 
      profile: string;
    },
    "hr": class SEnvHTMLHRElement extends SEnvHTMLElement implements HTMLHRElement { 
      size: number;
      color: string;
      align: string;
      noShade: boolean;
      width: number;
    },
    "html": class SEnvHTMLHtmlElement extends SEnvHTMLElement implements HTMLHtmlElement { 
      version: string;
    },
    "iframe": class SEnvHTMLIFrameElement extends SEnvHTMLElement implements HTMLIFrameElement {
      align: string;
      allowFullscreen: boolean;
      allowPaymentRequest: boolean;
      border: string;
      readonly contentDocument: Document;
      readonly contentWindow: Window;
      frameBorder: string;
      frameSpacing: any;
      height: string;
      hspace: number;
      longDesc: string;
      marginHeight: string;
      marginWidth: string;
      name: string;
      noResize: boolean;
      onload: (this: HTMLIFrameElement, ev: Event) => any;
      readonly sandbox: DOMSettableTokenList;
      scrolling: string;
      src: string;
      vspace: number;
      width: string;

      getSVGDocument(): Document {
        return null;
      }
    },
    "img": class SEnvHTMLImageElement extends SEnvHTMLElement implements HTMLImageElement {
      align: string;
      alt: string;
      border: string;
      readonly complete: boolean;
      crossOrigin: string | null;
      readonly currentSrc: string;
      height: number;
      hspace: number;
      isMap: boolean;
      longDesc: string;
      lowsrc: string;
      msPlayToDisabled: boolean;
      msPlayToPreferredSourceUri: string;
      msPlayToPrimary: boolean;
      readonly msPlayToSource: any;
      name: string;
      readonly naturalHeight: number;
      readonly naturalWidth: number;
      sizes: string;
      src: string;
      srcset: string;
      useMap: string;
      vspace: number;
      width: number;
      readonly x: number;
      readonly y: number;
      msGetAsCastingSource(): any { }
    },
    "input": class SEnvHTMLInputElement extends SEnvHTMLElement implements HTMLInputElement { 
      accept: string;
      align: string;
      alt: string;
      autocomplete: string;
      autofocus: boolean;
      border: string;
      checked: boolean;
      readonly complete: boolean;
      defaultChecked: boolean;
      defaultValue: string;
      disabled: boolean;
      readonly files: FileList | null;
      readonly form: HTMLFormElement;
      formAction: string;
      formEnctype: string;
      formMethod: string;
      formNoValidate: string;
      formTarget: string;
      height: string;
      hspace: number;
      indeterminate: boolean;
      readonly list: HTMLElement;
      max: string;
      maxLength: number;
      min: string;
      multiple: boolean;
      name: string;
      pattern: string;
      placeholder: string;
      readOnly: boolean;
      required: boolean;
      selectionDirection: string;
      selectionEnd: number;
      selectionStart: number;
      size: number;
      src: string;
      status: boolean;
      step: string;
      type: string;
      useMap: string;
      readonly validationMessage: string;
      readonly validity: ValidityState;
      value: string;
      valueAsDate: Date;
      valueAsNumber: number;
      vspace: number;
      webkitdirectory: boolean;
      width: string;
      readonly willValidate: boolean;
      minLength: number;
      checkValidity(): boolean {
        return false;
      }
      select(): void { }
      setCustomValidity(error: string): void { }
      setSelectionRange(start?: number, end?: number, direction?: string): void { }
      stepDown(n?: number): void { }
      stepUp(n?: number): void { }
    },
    "ins": class SEnvHTMLModElement extends SEnvHTMLElement implements HTMLModElement { 

      cite: string;
      dateTime: string;
    },
    "isindex": class SEnvHTMLUnknownElement extends SEnvHTMLElement implements HTMLUnknownElement {

    },
    "label": class SEnvHTMLLabelElement extends SEnvHTMLElement implements HTMLLabelElement { 
      readonly form: HTMLFormElement;
      htmlFor: string;
    },
    "legend": class SEnvHTMLLegendElement extends SEnvHTMLElement implements HTMLLegendElement { 
    
      align: string;
      readonly form: HTMLFormElement;
    },
    "li": class SEnvHTMLLIElement extends SEnvHTMLElement implements HTMLLIElement { 
      type: string;
      value: number;
    },
    "link": getSEnvHTMLLinkElementClass(context),
    "listing": class SEnvHTMLPreElement extends SEnvHTMLElement implements HTMLPreElement { 
      width: number;
    },
    "map": class SEnvHTMLMapElement extends SEnvHTMLElement implements HTMLMapElement { 
      readonly areas: HTMLAreasCollection;
      name: string;
    },
    "marquee": class SEnvHTMLMarqueeElement extends SEnvHTMLElement implements HTMLMarqueeElement { 
      behavior: string;
      bgColor: any;
      direction: string;
      height: string;
      hspace: number;
      loop: number;
      onbounce: (this: HTMLMarqueeElement, ev: Event) => any;
      onfinish: (this: HTMLMarqueeElement, ev: Event) => any;
      onstart: (this: HTMLMarqueeElement, ev: Event) => any;
      scrollAmount: number;
      scrollDelay: number;
      trueSpeed: boolean;
      vspace: number;
      width: string;
      start(): void { }
      stop(): void { }
    },
    "menu": class SEnvHTMLMenuElement extends SEnvHTMLElement implements HTMLMenuElement { 
      compact: boolean;
      type: string;
    },
    "meta": class SEnvHTMLMetaElement extends SEnvHTMLElement implements HTMLMetaElement {
      charset: string;
      content: string;
      httpEquiv: string;
      name: string;
      scheme: string;
      url: string;
    },
    "meter": class SEnvHTMLMeterElement extends SEnvHTMLElement implements HTMLMeterElement {
      high: number;
      low: number;
      max: number;
      min: number;
      optimum: number;
      value: number;
    },
    "nextid": class SEnvHTMLUnknownElement extends SEnvHTMLElement implements HTMLUnknownElement {

    },
    "object": class SEnvHTMLObjectElement extends SEnvHTMLElement implements HTMLObjectElement { 
      align: string;
      alt: string;
      altHtml: string;
      archive: string;
      readonly BaseHref: string;
      border: string;
      code: string;
      codeBase: string;
      codeType: string;
      readonly contentDocument: Document;
      data: string;
      declare: boolean;
      readonly form: HTMLFormElement;
      height: string;
      hspace: number;
      msPlayToDisabled: boolean;
      msPlayToPreferredSourceUri: string;
      msPlayToPrimary: boolean;
      readonly msPlayToSource: any;
      name: string;
      readonly readyState: number;
      standby: string;
      type: string;
      useMap: string;
      readonly validationMessage: string;
      readonly validity: ValidityState;
      vspace: number;
      width: string;
      readonly willValidate: boolean;
      checkValidity(): boolean {
        return false;
      }
      setCustomValidity(error: string): void { }

      getSVGDocument(): Document {
        return null;
      }
    },
    "ol": class SEnvHTMLOListElement extends SEnvHTMLElement implements HTMLOListElement { 
      compact: boolean;
      start: number;
      type: string;
    },
    "optgroup": class SEnvHTMLOptGroupElement extends SEnvHTMLElement implements HTMLOptGroupElement { 
      defaultSelected: boolean;
      disabled: boolean;
      readonly form: HTMLFormElement;
      readonly index: number;
      label: string;
      selected: boolean;
      readonly text: string;
      value: string;
    },
    "option": class SEnvHTMLOptionElement extends SEnvHTMLElement implements HTMLOptionElement {
      defaultSelected: boolean;
      disabled: boolean;
      readonly form: HTMLFormElement;
      readonly index: number;
      label: string;
      selected: boolean;
      text: string;
      value: string;
    },
    "output": class SEnvHTMLOutputElement extends SEnvHTMLElement implements HTMLOutputElement {
      defaultValue: string;
      readonly form: HTMLFormElement;
      readonly htmlFor: DOMSettableTokenList;
      name: string;
      readonly type: string;
      readonly validationMessage: string;
      readonly validity: ValidityState;
      value: string;
      readonly willValidate: boolean;
      checkValidity(): boolean {
        return false;
      }
      reportValidity(): boolean {
        return false;
      }
      setCustomValidity(error: string): void {

      }
    },
    "p": class SEnvHTMLParagraphElement extends SEnvHTMLElement implements HTMLParagraphElement { 
      align: string;
      clear: string;
    },
    "param": class SEnvHTMLParamElement extends SEnvHTMLElement implements HTMLParamElement { 
      name: string;
      type: string;
      value: string;
      valueType: string;
    },
    "picture": class SEnvHTMLPictureElement extends SEnvHTMLElement implements HTMLPictureElement {

    },
    "pre": class SEnvHTMLPreElement extends SEnvHTMLElement implements HTMLPreElement { 

      width: number;
    },
    "progress": class SEnvHTMLProgressElement extends SEnvHTMLElement implements HTMLProgressElement {
      readonly form: HTMLFormElement;
      max: number;
      readonly position: number;
      value: number;
    },
    "q": class SEnvHTMLQuoteElement extends SEnvHTMLElement implements HTMLQuoteElement { 
      cite: string;
    },
    "script": getSenvHTMLScriptElementClass(context),
    "select": class SEnvHTMLSelectElement extends SEnvHTMLElement implements HTMLSelectElement {
      autofocus: boolean;
      disabled: boolean;
      readonly form: HTMLFormElement;
      length: number;
      multiple: boolean;
      name: string;
      readonly options: HTMLOptionsCollection;
      required: boolean;
      selectedIndex: number;
      selectedOptions: HTMLCollectionOf<HTMLOptionElement>;
      size: number;
      readonly type: string;
      readonly validationMessage: string;
      readonly validity: ValidityState;
      value: string;
      readonly willValidate: boolean;
      add(element: HTMLElement, before?: HTMLElement | number): void {
        
      }
      checkValidity(): boolean {
        return false;
      }
      item(name?: any, index?: any): any { }
      namedItem(name: string): any { }
      remove(index?: number): void { }
      setCustomValidity(error: string): void { }
    },
    "source": class SEnvHTMLSourceElement extends SEnvHTMLElement implements HTMLSourceElement { 
      media: string;
      msKeySystem: string;
      sizes: string;
      src: string;
      srcset: string;
      type: string;
    },
    "span": class SEnvHTMLSpanElement extends SEnvHTMLElement implements HTMLSpanElement {

      disabled: boolean;
      media: string;
      type: string;
    },
    "style": getSEnvHTMLStyleElementClass(context),
    "table": class SEnvHTMLTableElement extends SEnvHTMLElement implements HTMLTableElement {
      align: string;
      bgColor: any;
      border: string;
      borderColor: any;
      caption: HTMLTableCaptionElement;
      cellPadding: string;
      cellSpacing: string;
      cols: number;
      frame: string;
      height: any;
      rows: HTMLCollectionOf<HTMLTableRowElement>;
      rules: string;
      summary: string;
      tBodies: HTMLCollectionOf<HTMLTableSectionElement>;
      tFoot: HTMLTableSectionElement;
      tHead: HTMLTableSectionElement;
      width: string;
      createCaption(): HTMLTableCaptionElement {
        return null;
      }
      createTBody(): HTMLTableSectionElement {
        return null;
      }
      createTFoot(): HTMLTableSectionElement {
        return null;
      }
      createTHead(): HTMLTableSectionElement {
        return null;
      }
      deleteCaption(): void { }
      deleteRow(index?: number): void { }
      deleteTFoot(): void { }
      deleteTHead(): void { }
      insertRow(index?: number): HTMLTableRowElement {
        return null;
      }
    },
    "tbody": class SEnvHTMLTableSectionElement extends SEnvHTMLElement implements HTMLTableSectionElement { 
      ch: string;
      chOff: string;
      vAlign: string;
      align: string;
      rows: HTMLCollectionOf<HTMLTableRowElement>;
      deleteRow(index?: number): void { }
      insertRow(index?: number): HTMLTableRowElement {
        return null;
      }
    },
    "td": class SEnvHTMLTableDataCellElement extends SEnvHTMLElement implements HTMLTableDataCellElement {
      ch: string;
      chOff: string;
      vAlign: string;
      abbr: string;
      align: string;
      axis: string;
      bgColor: any;
      readonly cellIndex: number;
      colSpan: number;
      headers: string;
      height: any;
      noWrap: boolean;
      rowSpan: number;
      scope: string;
      width: string;
    },
    "template": class SEnvHTMLTemplateElement extends SEnvHTMLElement implements HTMLTemplateElement {
      readonly content: DocumentFragment;
    },
    "textarea": class SEnvHTMLTextAreaElement extends SEnvHTMLElement implements HTMLTextAreaElement { 
      autofocus: boolean;
      cols: number;
      defaultValue: string;
      disabled: boolean;
      readonly form: HTMLFormElement;
      maxLength: number;
      name: string;
      placeholder: string;
      readOnly: boolean;
      required: boolean;
      rows: number;
      selectionEnd: number;
      selectionStart: number;
      status: any;
      readonly type: string;
      readonly validationMessage: string;
      readonly validity: ValidityState;
      value: string;
      readonly willValidate: boolean;
      wrap: string;
      minLength: number;
      checkValidity(): boolean {
        return false;
      }
      select(): void { }
      setCustomValidity(error: string): void { }
      setSelectionRange(start: number, end: number): void { }
    },
    "tfoot": class SEnvHTMLTableSectionElement extends SEnvHTMLElement implements HTMLTableSectionElement {
      ch: string;
      chOff: string;
      vAlign: string;
      align: string;
      rows: HTMLCollectionOf<HTMLTableRowElement>;
      deleteRow(index?: number): void { }
      insertRow(index?: number): HTMLTableRowElement {
        return null;
      }
    },
    "th": class SEnvHTMLTableHeaderCellElement extends SEnvHTMLElement implements HTMLTableHeaderCellElement {
      ch: string;
      chOff: string;
      vAlign: string;
      scope: string;
      abbr: string;
      align: string;
      axis: string;
      bgColor: any;
      readonly cellIndex: number;
      colSpan: number;
      headers: string;
      height: any;
      noWrap: boolean;
      rowSpan: number;
      width: string;
    },
    "thead": class SEnvHTMLTableSectionElement extends SEnvHTMLElement implements HTMLTableSectionElement { 
      ch: string;
      chOff: string;
      vAlign: string;
      align: string;
      rows: HTMLCollectionOf<HTMLTableRowElement>;
      deleteRow(index?: number): void { }
      insertRow(index?: number): HTMLTableRowElement {
        return null;
      }
    },
    "time": class SEnvHTMLTimeElement extends SEnvHTMLElement implements HTMLTimeElement {
      dateTime: string;
    },
    "title": class SEnvHTMLTitleElement extends SEnvHTMLElement implements HTMLTitleElement { 
      text: string;
    },
    "tr": class SEnvHTMLTableRowElement extends SEnvHTMLElement implements HTMLTableRowElement { 
      ch: string;
      chOff: string;
      vAlign: string;
      align: string;
      bgColor: any;
      cells: HTMLCollectionOf<HTMLTableDataCellElement | HTMLTableHeaderCellElement>;
      height: any;
      readonly rowIndex: number;
      readonly sectionRowIndex: number;
      deleteCell(index?: number): void { }
      insertCell(index?: number): HTMLTableDataCellElement {
        return null;
      }
    },
    "track": class SEnvHTMLTrackElement extends SEnvHTMLElement implements HTMLTrackElement { 
      default: boolean;
      kind: string;
      label: string;
      readonly readyState: number;
      src: string;
      srclang: string;
      readonly track: TextTrack;
      readonly ERROR: number;
      readonly LOADED: number;
      readonly LOADING: number;
      readonly NONE: number;
    },
    "ul": class SEnvHTMLUListElement extends SEnvHTMLElement implements HTMLUListElement { 
      compact: boolean;
      type: string;
    },
    "video": class SEnvHTMLVideoElement extends SEnvHTMLElement implements HTMLVideoElement {
      autoplay: boolean;
      readonly buffered: TimeRanges;
      controls: boolean;
      crossOrigin: string | null;
      readonly currentSrc: string;
      currentTime: number;
      defaultMuted: boolean;
      defaultPlaybackRate: number;
      readonly duration: number;
      readonly ended: boolean;
      readonly error: MediaError;
      loop: boolean;
      readonly mediaKeys: MediaKeys | null;
      msAudioCategory: string;
      msAudioDeviceType: string;
      readonly msGraphicsTrustStatus: MSGraphicsTrust;
      readonly msKeys: MSMediaKeys;
      msPlayToDisabled: boolean;
      msPlayToPreferredSourceUri: string;
      msPlayToPrimary: boolean;
      readonly msPlayToSource: any;
      msRealTime: boolean;
      muted: boolean;
      readonly networkState: number;
      onencrypted: (this: HTMLMediaElement, ev: MediaEncryptedEvent) => any;
      onmsneedkey: (this: HTMLMediaElement, ev: MSMediaKeyNeededEvent) => any;
      readonly paused: boolean;
      playbackRate: number;
      readonly played: TimeRanges;
      preload: string;
      readyState: number;
      readonly seekable: TimeRanges;
      readonly seeking: boolean;
      src: string;
      srcObject: MediaStream | null;
      readonly textTracks: TextTrackList;
      readonly videoTracks: VideoTrackList;
      volume: number;
      addTextTrack(kind: string, label?: string, language?: string): TextTrack {
        return null;
      }
      canPlayType(type: string): string {
        return null;
      }
      load(): void { }
      msClearEffects(): void { }
      msGetAsCastingSource(): any { }
      msInsertAudioEffect(activatableClassId: string, effectRequired: boolean, config?: any): void { }
      msSetMediaKeys(mediaKeys: MSMediaKeys): void { }
      msSetMediaProtectionManager(mediaProtectionManager?: any): void {

      }
      pause(): void { }
      play(): Promise<void>{
        return null;
      }
      setMediaKeys(mediaKeys: MediaKeys | null): Promise<void> {
        return null;
      }
      readonly audioTracks: AudioTrackList;
      readonly HAVE_CURRENT_DATA: number;
      readonly HAVE_ENOUGH_DATA: number;
      readonly HAVE_FUTURE_DATA: number;
      readonly HAVE_METADATA: number;
      readonly HAVE_NOTHING: number;
      readonly NETWORK_EMPTY: number;
      readonly NETWORK_IDLE: number;
      readonly NETWORK_LOADING: number;
      readonly NETWORK_NO_SOURCE: number;
      height: number;
      msHorizontalMirror: boolean;
      readonly msIsLayoutOptimalForPlayback: boolean;
      readonly msIsStereo3D: boolean;
      msStereo3DPackingMode: string;
      msStereo3DRenderMode: string;
      msZoom: boolean;
      onMSVideoFormatChanged: (this: HTMLVideoElement, ev: Event) => any;
      onMSVideoFrameStepCompleted: (this: HTMLVideoElement, ev: Event) => any;
      onMSVideoOptimalLayoutChanged: (this: HTMLVideoElement, ev: Event) => any;
      poster: string;
      readonly videoHeight: number;
      readonly videoWidth: number;
      readonly webkitDisplayingFullscreen: boolean;
      readonly webkitSupportsFullscreen: boolean;
      width: number;
      getVideoPlaybackQuality(): VideoPlaybackQuality {
        return null;
      }
      msFrameStep(forward: boolean): void { }
      msInsertVideoEffect(activatableClassId: string, effectRequired: boolean, config?: any): void { }
      msSetVideoRectangle(left: number, top: number, right: number, bottom: number): void { }
      webkitEnterFullscreen(): void { }
      webkitEnterFullScreen(): void { }
      webkitExitFullscreen(): void { }
      webkitExitFullScreen(): void { }
     },
    "xmp": class SEnvHTMLPreElement extends SEnvHTMLElement implements HTMLPreElement { 
      width: number;
    }
  };
});

export const diffHTMLNode = (oldElement: Node, newElement: Node) => {
  if (oldElement.nodeName === "LINK") {
    return diffHTMLLinkElement(oldElement as HTMLLinkElement, newElement as HTMLLinkElement);
  } else if (oldElement.nodeName === "STYLE") {
    return diffHTMLLinkElement(oldElement as HTMLLinkElement, newElement as HTMLLinkElement);
  }

  return diffBaseNode(oldElement, newElement, diffHTMLNode);
}

export const patchHTMLNode = (oldElement: HTMLElement, mutation: Mutation<any>) => {
  if (oldElement.nodeName === "LINK") {
    return patchHTMLLinkElement(oldElement as HTMLLinkElement, mutation);
  } else if (oldElement.nodeName === "STYLE") {
    return patchHTMLStyleElement(oldElement as HTMLStyleElement, mutation);
  }

  return patchBaseElement(oldElement, mutation);
}