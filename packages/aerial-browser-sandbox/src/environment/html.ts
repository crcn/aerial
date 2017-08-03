import { getSEnvNodeClass } from "./base/node";
import { weakMemo } from "aerial-common2";

export const getSEnvHTMLElementClass = weakMemo((window: Window) => {
  const SEnvNode = getSEnvNodeClass(window);
  return class HTMLElement extends SEnvNode implements HTMLElement {
    
    readonly classList: DOMTokenList;
    className: string;
    readonly clientHeight: number;
    readonly clientLeft: number;
    readonly clientTop: number;
    readonly clientWidth: number;
    id: string;
    innerHTML: string;
    msContentZoomFactor: number;
    readonly msRegionOverflow: string;
    onariarequest: (this: Element, ev: Event) => any;
    oncommand: (this: Element, ev: Event) => any;
    ongotpointercapture: (this: Element, ev: PointerEvent) => any;
    onlostpointercapture: (this: Element, ev: PointerEvent) => any;
    onmsgesturechange: (this: Element, ev: MSGestureEvent) => any;
    onmsgesturedoubletap: (this: Element, ev: MSGestureEvent) => any;
    onmsgestureend: (this: Element, ev: MSGestureEvent) => any;
    onmsgesturehold: (this: Element, ev: MSGestureEvent) => any;
    onmsgesturestart: (this: Element, ev: MSGestureEvent) => any;
    onmsgesturetap: (this: Element, ev: MSGestureEvent) => any;
    onmsgotpointercapture: (this: Element, ev: MSPointerEvent) => any;
    onmsinertiastart: (this: Element, ev: MSGestureEvent) => any;
    onmslostpointercapture: (this: Element, ev: MSPointerEvent) => any;
    onmspointercancel: (this: Element, ev: MSPointerEvent) => any;
    onmspointerdown: (this: Element, ev: MSPointerEvent) => any;
    onmspointerenter: (this: Element, ev: MSPointerEvent) => any;
    onmspointerleave: (this: Element, ev: MSPointerEvent) => any;
    onmspointermove: (this: Element, ev: MSPointerEvent) => any;
    onmspointerout: (this: Element, ev: MSPointerEvent) => any;
    onmspointerover: (this: Element, ev: MSPointerEvent) => any;
    onmspointerup: (this: Element, ev: MSPointerEvent) => any;
    ontouchcancel: (ev: TouchEvent) => any;
    ontouchend: (ev: TouchEvent) => any;
    ontouchmove: (ev: TouchEvent) => any;
    ontouchstart: (ev: TouchEvent) => any;
    onwebkitfullscreenchange: (this: Element, ev: Event) => any;
    onwebkitfullscreenerror: (this: Element, ev: Event) => any;
    outerHTML: string;
    readonly prefix: string | null;
    readonly scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    readonly scrollWidth: number;
    readonly tagName: string;
    readonly assignedSlot: HTMLSlotElement | null;
    slot: string;
    readonly shadowRoot: ShadowRoot | null;

    getAttribute(name: string): string | null {
      return null;
    }

    getAttributeNode(name: string): Attr {
      return null;
    }

    getAttributeNodeNS(namespaceURI: string, localName: string): Attr {
      return null;
    }

    getAttributeNS(namespaceURI: string, localName: string): string {
      return null;
    }

    getBoundingClientRect(): ClientRect {
      return null;
    }

    getClientRects(): ClientRectList {
      return null;
    }

    getElementsByTagName<K extends keyof ElementListTagNameMap>(name: K): ElementListTagNameMap[K];
    getElementsByTagName(name: string): NodeListOf<Element> {
      return null;
    }

    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<any>;
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
    getElementsByTagNameNS(namespaceURI: string, localName: string) {
      return null;
    }

    hasAttribute(name: string): boolean {
      return false;
    }

    hasAttributeNS(namespaceURI: string, localName: string): boolean {
      return false;
    }

    msGetRegionContent(): MSRangeCollection {
      return null;
    }

    msGetUntransformedBounds(): ClientRect {
      return null;
    }

    msMatchesSelector(selectors: string): boolean {
      return false;
    }

    msReleasePointerCapture(pointerId: number): void {

    }

    msSetPointerCapture(pointerId: number): void {

    }

    msZoomTo(args: MsZoomToOptions): void {

    }

    releasePointerCapture(pointerId: number): void {

    }

    removeAttribute(qualifiedName: string): void {

    }

    removeAttributeNode(oldAttr: Attr): Attr {
      return null;
    }

    removeAttributeNS(namespaceURI: string, localName: string): void {
      
    }

    requestFullscreen(): void {

    }

    requestPointerLock(): void {

    }

    setAttribute(name: string, value: string): void {

    }

    setAttributeNode(newAttr: Attr): Attr {
      return null;
    }

    setAttributeNodeNS(newAttr: Attr): Attr {
      return null;
    }

    setAttributeNS(namespaceURI: string, qualifiedName: string, value: string): void {

    }

    setPointerCapture(pointerId: number): void {
      
    }

    webkitMatchesSelector(selectors: string): boolean {
      return false;
    }

    webkitRequestFullscreen(): void {

    }

    webkitRequestFullScreen(): void {

    }

    getElementsByClassName(classNames: string): NodeListOf<Element> {
      return null;
    }

    matches(selector: string): boolean {
      return false;
    }

    closest(selector: string): Element | null {
      return null;
    }

    scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void {

    }

    scroll(...args): void {

    }

    scrollTo(...args): void {

    }

    scrollBy(...args): void {

    }

    insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element | null {
      return null;
    }

    insertAdjacentHTML(where: InsertPosition, html: string): void {

    }

    insertAdjacentText(where: InsertPosition, text: string): void {

    }

    attachShadow(shadowRootInitDict: ShadowRootInit): ShadowRoot {
      return null;
    }
  }
});

export const getSEnvHTMLElementClasses = weakMemo((options) => {
  const SEnvHTMLElement = getSEnvHTMLElementClass(options);

  // TOD 
  return {
    SEnvHTMLElement: SEnvHTMLElement,
    SEnvHTMLDivElement: class SEnvHTMLDivElement extends SEnvHTMLElement { },
    SEnvHTMLHtmlElement: class SEnvHTMLHtmlElement extends SEnvHTMLElement { },
    SEnvHTMLHeadElement: class SEnvHTMLHeadElement extends SEnvHTMLElement { },
    SEnvHTMLTitleElement: class SEnvHTMLTitleElement extends SEnvHTMLElement { },
    SEnvHTMLBodyElement: class SEnvHTMLBodyElement extends SEnvHTMLElement { },
    SEnvHTMLSpanElement: class SEnvHTMLSpanElement extends SEnvHTMLElement { }
  };
});