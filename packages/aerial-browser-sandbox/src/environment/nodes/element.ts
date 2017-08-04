import { weakMemo } from "aerial-common2";
import { getSEnvNodeClass, SEnvNodeAddon } from "./node";
import { SEnvNodeTypes } from "../constants";
import { getSEnvHTMLCollectionClasses } from "./collections";
import { getSEnvParentNodeClass } from "./parent-node";

export const getSEnvAttr = weakMemo((context: any) => {
  const SEnvNode = getSEnvNodeClass(context);
  return class SEnvAttr extends SEnvNode implements Attr {
    readonly prefix: string | null;
    readonly specified: boolean;
    constructor(readonly name: string, public value: string, readonly ownerElement: Element) {
      super();
    }
  }
});

export interface SEnvElementAddon extends Element {
  $preconstruct();
}

export const getSEnvElementClass = weakMemo((context: any) => {
  const SEnvAttr = getSEnvAttr(context);
  const SEnvNode = getSEnvNodeClass(context);
  const SEnvParentNode = getSEnvParentNodeClass(context);
  const { SEnvNamedNodeMap } = getSEnvHTMLCollectionClasses(context);

  return class SEnvElement extends SEnvParentNode implements SEnvElementAddon {

    readonly classList: DOMTokenList;
    className: string;
    readonly clientHeight: number;
    readonly clientLeft: number;
    readonly clientTop: number;
    readonly clientWidth: number;
    attributes: NamedNodeMap;
    nodeType: number = SEnvNodeTypes.ELEMENT;
    id: string;

    msContentZoomFactor: number;
    readonly msRegionOverflow: string;
    readonly children: HTMLCollection;
    readonly firstElementChild: Element | null;
    readonly lastElementChild: Element | null;
    readonly childElementCount: number;
    readonly addedNodes: NodeList;
    readonly attributeName: string | null;
    readonly attributeNamespace: string | null;
    readonly nextSibling: Node | null;
    readonly oldValue: string | null;
    readonly previousSibling: Node | null;
    readonly removedNodes: NodeList;
    readonly nextElementSibling: Element | null;
    readonly previousElementSibling: Element | null;
    readonly type: string;
    remove() {}
    onpointercancel: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerdown: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerenter: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerleave: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointermove: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerout: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerover: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onpointerup: (this: GlobalEventHandlers, ev: PointerEvent) => any;
    onwheel: (this: GlobalEventHandlers, ev: WheelEvent) => any;
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
    readonly prefix: string | null;
    readonly scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    readonly scrollWidth: number;
    readonly tagName: string;
    readonly assignedSlot: HTMLSlotElement | null;
    slot: string;
    readonly shadowRoot: ShadowRoot | null;


    $preconstruct() {
      super.$preconstruct();
      this.nodeType = SEnvNodeTypes.ELEMENT;

      this.attributes = new Proxy(new SEnvNamedNodeMap(), {
        get: (target: NamedNodeMap, key: string)  => {
          return target.getNamedItem(key);
        },
        set: (target, key: string, value: string, receiver)  => {
          target.setNamedItem(new SEnvAttr(key, value, this));
          return true;
        }
      });
    }

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

    get outerHTML(): string {
      let buffer = `<${this.nodeName.toLowerCase()}`;
      for (const name in this.attributes) {
        if (this.attributes[name]) {
          buffer += ` ${name}=${this.attributes[name].value}`;
        }
      }
      buffer += `>${this.innerHTML}</${this.nodeName.toLowerCase()}>`;
      return buffer;
    }

    get innerHTML(): string {
      return Array.prototype.map.call(this.childNodes, (child: Node) => {
        switch(child.nodeType) {
          case SEnvNodeTypes.TEXT: return (child as Text).nodeValue;
          case SEnvNodeTypes.COMMENT: return `<!--${(child as Comment).nodeValue}-->`;
          case SEnvNodeTypes.ELEMENT: return (child as Element).outerHTML;
        }
        return "";
      }).join("");
    }
    
    getElementsByTagName<K extends keyof ElementListTagNameMap>(name: K): ElementListTagNameMap[K];
    getElementsByTagName(name: string): NodeListOf<Element>{ 
      return null;
    }

    querySelector(selectors: string): Element | null {
      return null;
    }
    
    querySelectorAll<K extends keyof ElementListTagNameMap>(selectors: K): ElementListTagNameMap[K];
    querySelectorAll(selectors: string): NodeListOf<Element> {
      return null;
    }
    
    getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<any> { 
      return null;
    }
    
    hasAttribute(name: string): boolean { 
      return null;
    }
    
    hasAttributeNS(namespaceURI: string, localName: string): boolean{ 
      return null;
    }
    
    msGetRegionContent(): MSRangeCollection { 
      return null;
    }
    
    msGetUntransformedBounds(): ClientRect { 
      return null;
    }
    
    msMatchesSelector(selectors: string): boolean { 
      return null;
    }

    msReleasePointerCapture(pointerId: number): void { 
      return null;
    }

    msSetPointerCapture(pointerId: number): void { 
      return null;
    }

    msZoomTo(args: MsZoomToOptions): void { 
      return null;
    }

    releasePointerCapture(pointerId: number): void { 
      return null;
    }

    removeAttribute(qualifiedName: string): void { 
      return null;
    }

    removeAttributeNode(oldAttr: Attr): Attr { 
      return null;
    }

    removeAttributeNS(namespaceURI: string, localName: string): void { 
      return null;
    }

    requestFullscreen(): void { 
      return null;
    }

    requestPointerLock(): void { 
      return null;
    }

    setAttribute(name: string, value: string): void { 
      return null;
    }

    setAttributeNode(newAttr: Attr): Attr { 
      return null;
    }

    setAttributeNodeNS(newAttr: Attr): Attr { 
      return null;
    }

    setAttributeNS(namespaceURI: string, qualifiedName: string, value: string): void { 
      return null;
    }

    setPointerCapture(pointerId: number): void { 
      return null;
    }

    webkitMatchesSelector(selectors: string): boolean { 
      return null;
    }

    webkitRequestFullscreen(): void { 
      return null;
    }

    webkitRequestFullScreen(): void { 
      return null;
    }

    getElementsByClassName(classNames: string): NodeListOf<Element> { 
      return null;
    }

    matches(selector: string): boolean { 
      return null;
    }

    closest(selector: string): Element | null { 
      return null;
    }

    scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void { 
      return null;
    }

    scroll(...args): void { 
      return null;
    }


    scrollTo(...args): void { 
      return null;
    }

    scrollBy(...args): void { 
      return null;
    }

    insertAdjacentElement(position: InsertPosition, insertedElement: Element): Element | null { 
      return null;
    }

    insertAdjacentHTML(where: InsertPosition, html: string): void { 
      return null;
    }

    insertAdjacentText(where: InsertPosition, text: string): void { 
      return null;
    }

    attachShadow(shadowRootInitDict: ShadowRootInit): ShadowRoot { 
      return null;
    }

  }
});