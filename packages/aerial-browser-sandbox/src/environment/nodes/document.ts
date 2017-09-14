import { 
  weakMemo, 
  Mutation, 
  diffArray, 
  SetValueMutation, 
  SetPropertyMutation, 
  createPropertyMutation, 
  InsertChildMutation,
  RemoveChildMutation,
  eachArrayValueMutation, 
  createSetValueMutation,
  createInsertChildMutation,
  createMoveChildChildMutation,
  createRemoveChildChildMutation,
} from "aerial-common2";
import { SEnvWindowInterface } from "../window";
import { getSEnvNodeClass, SEnvNodeInterface, patchValueNode } from "./node";
import { getSEnvParentNodeClass, diffParentNode, patchParentNode, SEnvParentNodeInterface, SEnvParentNodeMutationTypes } from "./parent-node";
import { diffBaseNode } from "./element";
import { getL3EventClasses } from "../level3";
import { getSEnvEventClasses, SEnvMutationEventInterface } from "../events";
import { getSEnvHTMLCollectionClasses, SEnvNodeListInterface } from "./collections";
import { getSEnvTextClass, SEnvTextInterface } from "./text";
import { getSEnvCommentClass, SEnvCommentInterface } from "./comment";
import { SEnvHTMLElementInterface, getSEnvHTMLElementClass, diffHTMLNode, patchHTMLNode } from "./html-elements";
import { SEnvNodeTypes } from "../constants";
import { parseHTMLDocument, constructNodeTree, whenLoaded, mapExpressionToNode } from "./utils";
import { getSEnvDocumentFragment } from "./fragment";
import { SyntheticDocument, SYNTHETIC_DOCUMENT, SyntheticNode, SyntheticParentNode, BasicDocument } from "../../state";
import parse5 = require("parse5");

export interface SEnvDocumentInterface extends SEnvParentNodeInterface, Document {
  readonly struct: SyntheticDocument;
  defaultView: SEnvWindowInterface;
  childNodes: SEnvNodeListInterface;
  $load(content: string): void;
  $$update();
  $$setReadyState(readyState: string): any;
  $createElementWithoutConstruct(tagName: string): SEnvHTMLElementInterface;
  createDocumentFragment(): DocumentFragment & SEnvNodeInterface;
  createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
  createElement(tagName: string): SEnvHTMLElementInterface;
  createTextNode(value: string): SEnvTextInterface;
  createComment(value: string): SEnvCommentInterface;
  addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}

const CONSUME_TIMEOUT = 10;

export const getSEnvDocumentClass = weakMemo((context: any) => {
  const SEnvNode = getSEnvNodeClass(context);
  const SEnvParentNode = getSEnvParentNodeClass(context);
  const SEnvText = getSEnvTextClass(context);
  const SEnvComment = getSEnvCommentClass(context);
  const { SEnvMutationEvent } = getL3EventClasses(context);
  const { SEnvEvent, SEnvMutationEvent: SEnvMutationEvent2 } = getSEnvEventClasses(context);
  const SEnvDocumentFragment = getSEnvDocumentFragment(context);
  const SENvHTMLElement = getSEnvHTMLElementClass(context);
  const { SEnvStyleSheetList, SEnvHTMLAllCollection } = getSEnvHTMLCollectionClasses(context);

  const eventMap = {
    MutationEvent:  SEnvMutationEvent
  };

  return class SEnvDocument extends SEnvParentNode implements SEnvDocumentInterface {
    
    readonly activeElement: Element;
    private _readyState: string;
    readonly struct: SyntheticDocument;
    readonly structType: string = SYNTHETIC_DOCUMENT;
    private _parser: parse5.SAXParser;
    private _consumeWritePromise: Promise<any>;
    
    alinkColor: string;
    
    readonly nodeType: number = SEnvNodeTypes.DOCUMENT;
    
    anchors: HTMLCollectionOf<HTMLAnchorElement>;
    
    applets: HTMLCollectionOf<HTMLAppletElement>;
    
    bgColor: string;
    
    readonly characterSet: string;
    
    charset: string;
    
    readonly compatMode: string;
    cookie: string;
    readonly currentScript: HTMLScriptElement | SVGScriptElement;
    
    designMode: string;
    
    dir: string;
    
    readonly doctype: DocumentType;
    
    domain: string;
    
    embeds: HTMLCollectionOf<HTMLEmbedElement>;
    
    fgColor: string;
    readonly nodeName: string = "#document";
    
    forms: HTMLCollectionOf<HTMLFormElement>;
    readonly fullscreenElement: Element | null;
    readonly fullscreenEnabled: boolean;
    readonly hidden: boolean;
    
    images: HTMLCollectionOf<HTMLImageElement>;
    
    readonly implementation: DOMImplementation;
    
    readonly inputEncoding: string | null;
    
    readonly lastModified: string;
    
    linkColor: string;
    
    links: HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement>;
    
    readonly location: Location;
    msCapsLockWarningOff: boolean;
    msCSSOMElementFloatMetrics: boolean;

    private _stylesheets: StyleSheetList;

    constructor(readonly defaultView: SEnvWindowInterface) {
      super();
      this.addEventListener("readystatechange", e => this.onreadystatechange && this.onreadystatechange(e));
      defaultView.childObjects.set(this.$id, this);
    }

    get stylesheets(): StyleSheetList {
      return this._stylesheets || (this._stylesheets = this._createStyleSheetList());
    }

    get styleSheets(): StyleSheetList {
      return this.stylesheets;
    }

    get all() {
      return new SEnvHTMLAllCollection(...Array.from(this.querySelectorAll("*")));
    }
    
    get readyState() {
      return this._readyState;
    }

    get documentElement(): SEnvHTMLElementInterface {
      return this.children[0] as SEnvHTMLElementInterface;
    }

    get head() {
      return this.documentElement.children[0] as HTMLHeadElement;
    }

    get body() {
      return this.documentElement.children[1] as HTMLBodyElement;
    }

    protected _linkChild(child: SEnvNodeInterface) {
      super._linkChild(child);
      child.$$addedToDocument(true);
    }

    async $load(content: string) {

      // TODO - use sax parsing here instead
      this.$$setReadyState("loading");

      const expression = parseHTMLDocument(content);
      await mapExpressionToNode(expression, this, this, true);

      this.$$setReadyState("interactive");

      const domContentLoadedEvent = new SEnvEvent();
      domContentLoadedEvent.initEvent("DOMContentLoaded", true, true);
      this.dispatchEvent(domContentLoadedEvent);

      // wait for images, stylesheets, and other external resources
      try {
        await whenLoaded(this);
      } catch(e) {
        // catch anyways since we want to fire a load completion
        this.defaultView.console.error(e);
      }

      const loadEvent = new SEnvEvent();
      loadEvent.initEvent("load", true, true);
      this.dispatchEvent(loadEvent);

      this.$$setReadyState("complete");
    }

    $$setReadyState(state) {
      if (this._readyState === state) {
        return;
      }
      this._readyState = state;
      const me = new SEnvMutationEvent2();
      me.initMutationEvent(createReadyStateChangeMutation(this, this.readyState));
      this.dispatchEvent(me);

      const event = new SEnvEvent();
      event.initEvent("readystatechange", true, true);
      this.dispatchEvent(event);
    }

    $$update() {
    }
    elementsFromPoint(x: number, y: number) {
      return null;
    }
    
    onabort: (this: Document, ev: UIEvent) => any;
    
    onactivate: (this: Document, ev: UIEvent) => any;
    
    onbeforeactivate: (this: Document, ev: UIEvent) => any;
    
    onbeforedeactivate: (this: Document, ev: UIEvent) => any;
    
    onblur: (this: Document, ev: FocusEvent) => any;
    oncanplay: (this: Document, ev: Event) => any;
    oncanplaythrough: (this: Document, ev: Event) => any;
    onchange: (this: Document, ev: Event) => any
    onclick: (this: Document, ev: MouseEvent) => any;
    oncontextmenu: (this: Document, ev: PointerEvent) => any;
    
    ondblclick: (this: Document, ev: MouseEvent) => any;
    
    ondeactivate: (this: Document, ev: UIEvent) => any;
    
    ondrag: (this: Document, ev: DragEvent) => any;
    
    ondragend: (this: Document, ev: DragEvent) => any;
    
    ondragenter: (this: Document, ev: DragEvent) => any;
    
    ondragleave: (this: Document, ev: DragEvent) => any;
    
    ondragover: (this: Document, ev: DragEvent) => any;
    
    ondragstart: (this: Document, ev: DragEvent) => any;
    ondrop: (this: Document, ev: DragEvent) => any;
    
    ondurationchange: (this: Document, ev: Event) => any;
    
    onemptied: (this: Document, ev: Event) => any;
    
    onended: (this: Document, ev: MediaStreamErrorEvent) => any;
    
    onerror: (this: Document, ev: ErrorEvent) => any;
    
    onfocus: (this: Document, ev: FocusEvent) => any;
    onfullscreenchange: (this: Document, ev: Event) => any;
    onfullscreenerror: (this: Document, ev: Event) => any;
    oninput: (this: Document, ev: Event) => any;
    oninvalid: (this: Document, ev: Event) => any;
    
    onkeydown: (this: Document, ev: KeyboardEvent) => any;
    
    onkeypress: (this: Document, ev: KeyboardEvent) => any;
    
    onkeyup: (this: Document, ev: KeyboardEvent) => any;
    
    onload: (this: Document, ev: Event) => any;
    
    onloadeddata: (this: Document, ev: Event) => any;
    
    onloadedmetadata: (this: Document, ev: Event) => any;
    
    onloadstart: (this: Document, ev: Event) => any;
    
    onmousedown: (this: Document, ev: MouseEvent) => any;
    
    onmousemove: (this: Document, ev: MouseEvent) => any;
    
    onmouseout: (this: Document, ev: MouseEvent) => any;
    
    onmouseover: (this: Document, ev: MouseEvent) => any;
    
    onmouseup: (this: Document, ev: MouseEvent) => any;
    
    onmousewheel: (this: Document, ev: WheelEvent) => any;
    onmscontentzoom: (this: Document, ev: UIEvent) => any;
    onmsgesturechange: (this: Document, ev: MSGestureEvent) => any;
    onmsgesturedoubletap: (this: Document, ev: MSGestureEvent) => any;
    onmsgestureend: (this: Document, ev: MSGestureEvent) => any;
    onmsgesturehold: (this: Document, ev: MSGestureEvent) => any;
    onmsgesturestart: (this: Document, ev: MSGestureEvent) => any;
    onmsgesturetap: (this: Document, ev: MSGestureEvent) => any;
    onmsinertiastart: (this: Document, ev: MSGestureEvent) => any;
    onmsmanipulationstatechanged: (this: Document, ev: MSManipulationEvent) => any;
    onmspointercancel: (this: Document, ev: MSPointerEvent) => any;
    onmspointerdown: (this: Document, ev: MSPointerEvent) => any;
    onmspointerenter: (this: Document, ev: MSPointerEvent) => any;
    onmspointerleave: (this: Document, ev: MSPointerEvent) => any;
    onmspointermove: (this: Document, ev: MSPointerEvent) => any;
    onmspointerout: (this: Document, ev: MSPointerEvent) => any;
    onmspointerover: (this: Document, ev: MSPointerEvent) => any;
    onmspointerup: (this: Document, ev: MSPointerEvent) => any;
    
    onmssitemodejumplistitemremoved: (this: Document, ev: MSSiteModeEvent) => any;
    
    onmsthumbnailclick: (this: Document, ev: MSSiteModeEvent) => any;
    
    onpause: (this: Document, ev: Event) => any;
    
    onplay: (this: Document, ev: Event) => any;
    
    onplaying: (this: Document, ev: Event) => any;
    onpointerlockchange: (this: Document, ev: Event) => any;
    onpointerlockerror: (this: Document, ev: Event) => any;
    
    onprogress: (this: Document, ev: ProgressEvent) => any;
    
    onratechange: (this: Document, ev: Event) => any;
    
    onreadystatechange: (this: Document, ev: Event) => any;
    
    onreset: (this: Document, ev: Event) => any;
    
    onscroll: (this: Document, ev: UIEvent) => any;
    
    onseeked: (this: Document, ev: Event) => any;
    
    onseeking: (this: Document, ev: Event) => any;
    
    onselect: (this: Document, ev: UIEvent) => any;
    
    onselectionchange: (this: Document, ev: Event) => any;
    onselectstart: (this: Document, ev: Event) => any;
    
    onstalled: (this: Document, ev: Event) => any;
    
    onstop: (this: Document, ev: Event) => any;
    onsubmit: (this: Document, ev: Event) => any;
    
    onsuspend: (this: Document, ev: Event) => any;
    
    ontimeupdate: (this: Document, ev: Event) => any;
    ontouchcancel: (ev: TouchEvent) => any;
    ontouchend: (ev: TouchEvent) => any;
    ontouchmove: (ev: TouchEvent) => any;
    ontouchstart: (ev: TouchEvent) => any;
    
    onvolumechange: (this: Document, ev: Event) => any;
    onpointercancel: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerdown: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerenter: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerleave: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointermove: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerout: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerover: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerup: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onwheel: (this: GlobalEventHandlers, ev: WheelEvent) => any;
    
    onwaiting: (this: Document, ev: Event) => any;
    onwebkitfullscreenchange: (this: Document, ev: Event) => any;
    onwebkitfullscreenerror: (this: Document, ev: Event) => any;
    plugins: HTMLCollectionOf<HTMLEmbedElement>;
    readonly pointerLockElement: Element;
    
    readonly referrer: string;
    
    readonly rootElement: SVGSVGElement;
    
    scripts: HTMLCollectionOf<HTMLScriptElement>;
    readonly scrollingElement: Element | null;
    
    readonly URL: string;
    
    readonly URLUnencoded: string;
    readonly visibilityState: VisibilityState;
    
    vlinkColor: string;
    readonly webkitCurrentFullScreenElement: Element | null;
    readonly webkitFullscreenElement: Element | null;
    readonly webkitFullscreenEnabled: boolean;
    readonly webkitIsFullScreen: boolean;
    readonly xmlEncoding: string | null;
    xmlStandalone: boolean;
    
    xmlVersion: string | null;

    adoptNode<T extends Node>(source: T): T {
      return null;
    }
    captureEvents(): void {

    }
    caretRangeFromPoint(x: number, y: number): Range {
      return null;
    }

    clear(): void {

    }
    
    close(): void {

    }

    createAttribute(name: string): Attr {
      return null;
    }

    get title() {
      const titleEl = this.querySelector("title");
      return titleEl && titleEl.textContent;
    }

    createStruct():  SyntheticDocument {
      const titleEl = this.querySelector("title");
      return {
        ...(super.createStruct() as any),
        title: this.title
      }
    }

    private _createStyleSheetList() {

      const styleSheets = [];
      
      Array.prototype.forEach.call(this.querySelectorAll("*"), (element) => {
        if (element.nodeType === SEnvNodeTypes.ELEMENT && element["sheet"]) {
          styleSheets.push(element["sheet"]);
        }
      });

      return new SEnvStyleSheetList(...styleSheets);
    }

    createAttributeNS(namespaceURI: string | null, qualifiedName: string): Attr {
      return null;
    }

    createCDATASection(data: string): CDATASection {
      return null;
    }
    
    createComment(data: string): SEnvCommentInterface {
      return this._linkNode(new SEnvComment(data));
    }

    createDocumentFragment(): DocumentFragment & SEnvNodeInterface {
      return this._linkNode(new SEnvDocumentFragment());
    }

    createEvent(eventInterface: "AnimationEvent"): AnimationEvent;
    createEvent(eventInterface: "AudioProcessingEvent"): AudioProcessingEvent;
    createEvent(eventInterface: "BeforeUnloadEvent"): BeforeUnloadEvent;
    createEvent(eventInterface: "ClipboardEvent"): ClipboardEvent;
    createEvent(eventInterface: "CloseEvent"): CloseEvent;
    createEvent(eventInterface: "CompositionEvent"): CompositionEvent;
    createEvent(eventInterface: "CustomEvent"): CustomEvent;
    createEvent(eventInterface: "DeviceLightEvent"): DeviceLightEvent;
    createEvent(eventInterface: "DeviceMotionEvent"): DeviceMotionEvent;
    createEvent(eventInterface: "DeviceOrientationEvent"): DeviceOrientationEvent;
    createEvent(eventInterface: "DragEvent"): DragEvent;
    createEvent(eventInterface: "ErrorEvent"): ErrorEvent;
    createEvent(eventInterface: "Event"): Event;
    createEvent(eventInterface: "Events"): Event;
    createEvent(eventInterface: "FocusEvent"): FocusEvent;
    createEvent(eventInterface: "FocusNavigationEvent"): FocusNavigationEvent;
    createEvent(eventInterface: "GamepadEvent"): GamepadEvent;
    createEvent(eventInterface: "HashChangeEvent"): HashChangeEvent;
    createEvent(eventInterface: "IDBVersionChangeEvent"): IDBVersionChangeEvent;
    createEvent(eventInterface: "KeyboardEvent"): KeyboardEvent;
    createEvent(eventInterface: "ListeningStateChangedEvent"): ListeningStateChangedEvent;
    createEvent(eventInterface: "LongRunningScriptDetectedEvent"): LongRunningScriptDetectedEvent;
    createEvent(eventInterface: "MSGestureEvent"): MSGestureEvent;
    createEvent(eventInterface: "MSManipulationEvent"): MSManipulationEvent;
    createEvent(eventInterface: "MSMediaKeyMessageEvent"): MSMediaKeyMessageEvent;
    createEvent(eventInterface: "MSMediaKeyNeededEvent"): MSMediaKeyNeededEvent;
    createEvent(eventInterface: "MSPointerEvent"): MSPointerEvent;
    createEvent(eventInterface: "MSSiteModeEvent"): MSSiteModeEvent;
    createEvent(eventInterface: "MediaEncryptedEvent"): MediaEncryptedEvent;
    createEvent(eventInterface: "MediaKeyMessageEvent"): MediaKeyMessageEvent;
    createEvent(eventInterface: "MediaStreamErrorEvent"): MediaStreamErrorEvent;
    createEvent(eventInterface: "MediaStreamEvent"): MediaStreamEvent;
    createEvent(eventInterface: "MediaStreamTrackEvent"): MediaStreamTrackEvent;
    createEvent(eventInterface: "MessageEvent"): MessageEvent;
    createEvent(eventInterface: "MouseEvent"): MouseEvent;
    createEvent(eventInterface: "MouseEvents"): MouseEvent;
    createEvent(eventInterface: "MutationEvent"): MutationEvent;
    createEvent(eventInterface: "MutationEvents"): MutationEvent;
    createEvent(eventInterface: "NavigationCompletedEvent"): NavigationCompletedEvent;
    createEvent(eventInterface: "NavigationEvent"): NavigationEvent;
    createEvent(eventInterface: "NavigationEventWithReferrer"): NavigationEventWithReferrer;
    createEvent(eventInterface: "OfflineAudioCompletionEvent"): OfflineAudioCompletionEvent;
    createEvent(eventInterface: "OverflowEvent"): OverflowEvent;
    createEvent(eventInterface: "PageTransitionEvent"): PageTransitionEvent;
    createEvent(eventInterface: "PaymentRequestUpdateEvent"): PaymentRequestUpdateEvent;
    createEvent(eventInterface: "PermissionRequestedEvent"): PermissionRequestedEvent;
    createEvent(eventInterface: "PointerEvent"): PointerEvent;
    createEvent(eventInterface: "PopStateEvent"): PopStateEvent;
    createEvent(eventInterface: "ProgressEvent"): ProgressEvent;
    createEvent(eventInterface: "RTCDTMFToneChangeEvent"): RTCDTMFToneChangeEvent;
    createEvent(eventInterface: "RTCDtlsTransportStateChangedEvent"): RTCDtlsTransportStateChangedEvent;
    createEvent(eventInterface: "RTCIceCandidatePairChangedEvent"): RTCIceCandidatePairChangedEvent;
    createEvent(eventInterface: "RTCIceGathererEvent"): RTCIceGathererEvent;
    createEvent(eventInterface: "RTCIceTransportStateChangedEvent"): RTCIceTransportStateChangedEvent;
    createEvent(eventInterface: "RTCPeerConnectionIceEvent"): RTCPeerConnectionIceEvent;
    createEvent(eventInterface: "RTCSsrcConflictEvent"): RTCSsrcConflictEvent;
    createEvent(eventInterface: "SVGZoomEvent"): SVGZoomEvent;
    createEvent(eventInterface: "SVGZoomEvents"): SVGZoomEvent;
    createEvent(eventInterface: "ScriptNotifyEvent"): ScriptNotifyEvent;
    createEvent(eventInterface: "ServiceWorkerMessageEvent"): ServiceWorkerMessageEvent;
    createEvent(eventInterface: "SpeechSynthesisEvent"): SpeechSynthesisEvent;
    createEvent(eventInterface: "StorageEvent"): StorageEvent;
    createEvent(eventInterface: "TextEvent"): TextEvent;
    createEvent(eventInterface: "TouchEvent"): TouchEvent;
    createEvent(eventInterface: "TrackEvent"): TrackEvent;
    createEvent(eventInterface: "TransitionEvent"): TransitionEvent;
    createEvent(eventInterface: "UIEvent"): UIEvent;
    createEvent(eventInterface: "UIEvents"): UIEvent;
    createEvent(eventInterface: "UnviewableContentIdentifiedEvent"): UnviewableContentIdentifiedEvent;
    createEvent(eventInterface: "WebGLContextEvent"): WebGLContextEvent;
    createEvent(eventInterface: "WheelEvent"): WheelEvent;
    createEvent(eventInterface: string): Event {
      const eventClass = eventMap[eventInterface];
      return eventClass && Object.create(eventClass.prototype);
    }
    
    createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
    createElement(tagName: string): SEnvHTMLElementInterface {
      return constructNodeTree(this.$createElementWithoutConstruct(tagName)) as SEnvHTMLElementInterface;
    }

    $createElementWithoutConstruct(tagName: string): SEnvHTMLElementInterface {
      const elementClass = this.defaultView.customElements.get(tagName) || SENvHTMLElement;
      const instance = this._linkNode(Object.create(elementClass.prototype));
      instance["" + "tagName"] = tagName.toUpperCase();
      instance["" + "nodeName"] = tagName.toUpperCase();
      instance.$$preconstruct();
      return instance;
    }

    private _linkNode<T extends Node>(node: T): T {
      node["" + "_ownerDocument"] = this;
      return node;
    }
    createElementNS(namespaceURI: "http://www.w3.org/1999/xhtml", qualifiedName: string): HTMLElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "a"): SVGAElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "circle"): SVGCircleElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "clipPath"): SVGClipPathElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "componentTransferFunction"): SVGComponentTransferFunctionElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "defs"): SVGDefsElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "desc"): SVGDescElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "ellipse"): SVGEllipseElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feBlend"): SVGFEBlendElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feColorMatrix"): SVGFEColorMatrixElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feComponentTransfer"): SVGFEComponentTransferElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feComposite"): SVGFECompositeElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feConvolveMatrix"): SVGFEConvolveMatrixElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feDiffuseLighting"): SVGFEDiffuseLightingElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feDisplacementMap"): SVGFEDisplacementMapElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feDistantLight"): SVGFEDistantLightElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feFlood"): SVGFEFloodElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feFuncA"): SVGFEFuncAElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feFuncB"): SVGFEFuncBElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feFuncG"): SVGFEFuncGElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feFuncR"): SVGFEFuncRElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feGaussianBlur"): SVGFEGaussianBlurElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feImage"): SVGFEImageElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feMerge"): SVGFEMergeElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feMergeNode"): SVGFEMergeNodeElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feMorphology"): SVGFEMorphologyElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feOffset"): SVGFEOffsetElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "fePointLight"): SVGFEPointLightElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feSpecularLighting"): SVGFESpecularLightingElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feSpotLight"): SVGFESpotLightElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feTile"): SVGFETileElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "feTurbulence"): SVGFETurbulenceElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "filter"): SVGFilterElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "foreignObject"): SVGForeignObjectElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "g"): SVGGElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "image"): SVGImageElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "gradient"): SVGGradientElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "line"): SVGLineElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "linearGradient"): SVGLinearGradientElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "marker"): SVGMarkerElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "mask"): SVGMaskElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "path"): SVGPathElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "metadata"): SVGMetadataElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "pattern"): SVGPatternElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "polygon"): SVGPolygonElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "polyline"): SVGPolylineElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "radialGradient"): SVGRadialGradientElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "rect"): SVGRectElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "svg"): SVGSVGElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "script"): SVGScriptElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "stop"): SVGStopElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "style"): SVGStyleElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "switch"): SVGSwitchElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "symbol"): SVGSymbolElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "tspan"): SVGTSpanElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "textContent"): SVGTextContentElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "text"): SVGTextElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "textPath"): SVGTextPathElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "textPositioning"): SVGTextPositioningElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "title"): SVGTitleElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "use"): SVGUseElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: "view"): SVGViewElement;
    createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: string): SVGElement;
    createElementNS(namespaceURI: string | null, qualifiedName: string): Element {
      return null;
    }
    
    createExpression(expression: string, resolver: XPathNSResolver): XPathExpression {
      return null;
    }
    
    createNodeIterator(root: Node, whatToShowe?: number, filter?: NodeFilter, entityReferenceExpansion?: boolean): NodeIterator {
      return null;
    }

    createNSResolver(nodeResolver: Node): XPathNSResolver {
      return null;
    }
    createProcessingInstruction(target: string, data: string): ProcessingInstruction {
      return null;
    }
    
    createRange(): Range {
      return null;
    }
    
    createTextNode(data: string): Text & SEnvNodeInterface {
      return this._linkNode(new SEnvText(data));
    }

    createTouch(view: Window, target: EventTarget, identifier: number, pageX: number, pageY: number, screenX: number, screenY: number): Touch {
      return null;
    }
    createTouchList(...touches: Touch[]): TouchList {
      return null;
    }
    
    createTreeWalker(root: Node, whatToShow?: number, filter?: NodeFilter, entityReferenceExpansion?: boolean): TreeWalker {
      return null;
    }
    
    elementFromPoint(x: number, y: number): Element {
      return null;
    }
    evaluate(expression: string, contextNode: Node, resolver: XPathNSResolver | null, type: number, result: XPathResult | null): XPathResult {
      return null;
    }
    
    execCommand(commandId: string, showUI?: boolean, value?: any): boolean {
      return null;
    }
    
    execCommandShowHelp(commandId: string): boolean {
      return false;
    }
    exitFullscreen(): void {

    }
    exitPointerLock(): void {

    }
    
    focus(): void {

    }
    
    getElementById(elementId: string): HTMLElement | null {
      return this.querySelector(`#${elementId}`) as HTMLElement;
    }

    getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
      this._throwUnsupportedMethod();
      return null;
    }
    
    getElementsByName(elementName: string): NodeListOf<HTMLElement> {
      this._throwUnsupportedMethod();
      return null;
    }
    
    getElementsByTagName<K extends keyof ElementListTagNameMap>(tagname: K): ElementListTagNameMap[K];
    getElementsByTagName(tagName: string): NodeListOf<Element> {
      return this.querySelectorAll(tagName);
    }
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
    getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element> {
      this._throwUnsupportedMethod();
      return null;
    }
    
    getSelection(): Selection {
      this._throwUnsupportedMethod();
      return null;
    }
    
    hasFocus(): boolean {
      this._throwUnsupportedMethod();
      return false;
    }
    importNode<T extends Node>(importedNode: T, deep: boolean): T {
      this._throwUnsupportedMethod();
      return null;
    }
    msElementsFromPoint(x: number, y: number): NodeListOf<Element> {
      this._throwUnsupportedMethod();
      return null;
    }
    msElementsFromRect(left: number, top: number, width: number, height: number): NodeListOf<Element> {
      return null;
    }
    
    open(url?: string, name?: string, features?: string, replace?: boolean): Document {
      return null;
    }
    
    queryCommandEnabled(commandId: string): boolean {
      return false;
    }
    
    queryCommandIndeterm(commandId: string): boolean {
      return false;
    }
    
    queryCommandState(commandId: string): boolean {
      return false;
    }
    
    queryCommandSupported(commandId: string): boolean {
      return false;
    }
    
    queryCommandText(commandId: string): string {
      return null;
    }
    
    queryCommandValue(commandId: string): string {
      return null;
    }
    releaseEvents(): void {

    }
    
    updateSettings(): void {

    }
    webkitCancelFullScreen(): void {

    }
    webkitExitFullscreen(): void {

    }
    
    write(...content: string[]): void {
      this._throwUnsupportedMethod();
    }

    writeln(...content: string[]): void {
      this._throwUnsupportedMethod();
    }

    protected _onMutation(event: SEnvMutationEventInterface) {
      super._onMutation(event);
      const { mutation } = event;

      if (mutation.$type === SEnvParentNodeMutationTypes.INSERT_CHILD_NODE_EDIT || mutation.$type === SEnvParentNodeMutationTypes.REMOVE_CHILD_NODE_EDIT) {
        this._stylesheets = null;
      }
    }
  };
});

export const READY_STATE_CHANGE = "READY_STATE_CHANGE";
export const INSERT_STYLE_SHEET = "INSERT_STYLE_SHEET";
export const REMOVE_STYLE_SHEET = "REMOVE_STYLE_SHEET";
export const MOVE_STYLE_SHEET = "MOVE_STYLE_SHEET";

// export const createInsertStyleSheetMutation = (target: SEnvDocumentInterface, sheet: CSSStyleSheet, index?: number) => createInsertChildMutation(INSERT_STYLE_SHEET, target, sheet, index);
// export const createRemoveStyleSheetMutation = (target: SEnvDocumentInterface, sheet: CSSStyleSheet, index?: number) => createRemoveChildChildMutation(REMOVE_STYLE_SHEET, target, sheet, index);
// export const createMoveStyleSheetMutation = (target: SEnvDocumentInterface, sheet: CSSStyleSheet, index: number, oldIndex) => createMoveChildChildMutation(MOVE_STYLE_SHEET, target, sheet, index, oldIndex);

const createReadyStateChangeMutation = (target: SEnvDocumentInterface, readyState: string): SetValueMutation<SEnvDocumentInterface> => createSetValueMutation(READY_STATE_CHANGE, target, readyState)

export const diffDocument = (oldDocument: SEnvDocumentInterface, newDocument: SEnvDocumentInterface) => {
  const mutations = [];
  const endMutations = [];
  if (oldDocument.readyState !== newDocument.readyState) {
    endMutations.push(createReadyStateChangeMutation(oldDocument, newDocument.readyState));
  }

  // const cssDiffs = diffArray(
  //   Array.from(oldDocument.stylesheets), 
  //   Array.from(newDocument.stylesheets), 

  //   // TODO - check ids. cssText is a very poor rep here
  //   (a: CSSStyleSheet, b: CSSStyleSheet) => a.href === b.href ? 0 : a.cssText === b.cssText ? 0 : -1
  // );

  // eachArrayValueMutation(cssDiffs, {
  //   insert({ value, index }) {
  //     mutations.push(createRemoveStyleSheetMutation(oldDocument, value as CSSStyleSheet, index));
  //   },
  //   delete({ index }) {
  //     mutations.push(createRemoveStyleSheetMutation(oldDocument, oldDocument.stylesheets.item(index) as CSSStyleSheet, index));
  //   },
  //   update({ originalOldIndex, patchedOldIndex, newValue, index }) {
  //     if (patchedOldIndex !== index) {
  //       mutations.push(createMoveStyleSheetMutation(oldDocument, oldDocument.stylesheets.item(originalOldIndex) as CSSStyleSheet, index, patchedOldIndex));
  //     }

  //     // TODO - diff & patch style sheet 
  //     // const oldValue = originalOldIndex.childNodes[originalOldIndex];
  //     // mutations.push(...diffChildNode(oldValue, newValue));
  //   }
  // })

  return [
    ...mutations,
    ...diffParentNode(oldDocument, newDocument, diffHTMLNode),

    // ready state mutation must come last
    ...endMutations
  ];
};

export const patchDocument = (oldDocument: SEnvDocumentInterface, mutation: Mutation<any>) => {
  patchParentNode(oldDocument, mutation);
  if (mutation.$type === READY_STATE_CHANGE) {
    oldDocument.$$setReadyState((mutation as SetValueMutation<SEnvDocumentInterface>).newValue);
  }
};


export const waitForDocumentComplete = (window: Window) => new Promise((resolve) => {
  if (window.document.readyState === "complete") {
    return resolve();
  }
  window.document.addEventListener("readystatechange", () => {
    if (window.document.readyState === "complete") {
      resolve();
    }
  });
});