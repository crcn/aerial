import { diffComment } from "./comment";
import { difference } from "lodash";
import { diffTextNode } from "./text";
import { SEnvNodeTypes } from "../constants";
import { weakMemo, diffArray, eachArrayValueMutation } from "aerial-common2";
import { getSEnvParentNodeClass, diffParentNode, SEnvParentNodeInterface } from "./parent-node";
import { evaluateHTMLDocumentFragment, constructNode } from "./utils";
import { getSEnvHTMLCollectionClasses } from "./collections";
import { getSEnvNodeClass, SEnvNodeInterface } from "./node";

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

export interface SEnvElementInterface extends SEnvParentNodeInterface, Element {
  $$preconstruct();
  addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
}

export const getSEnvElementClass = weakMemo((context: any) => {
  const SEnvAttr = getSEnvAttr(context);
  const SEnvNode = getSEnvNodeClass(context);
  const SEnvParentNode = getSEnvParentNodeClass(context);
  const { SEnvNamedNodeMap } = getSEnvHTMLCollectionClasses(context);

  return class SEnvElement extends SEnvParentNode implements SEnvElementInterface {

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
    readonly addedNodes: NodeList;
    readonly oldValue: string | null;
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

    $$preconstruct() {
      super.$$preconstruct();
      this.nodeType = SEnvNodeTypes.ELEMENT;

      this.attributes = new Proxy(new SEnvNamedNodeMap(), {
        get: (target: NamedNodeMap, key: string)  => {
          return typeof target[key] === "function" ? target[key].bind(target) : target[key];
        },
        set: (target, key: string, value: string, receiver)  => {
          target.setNamedItem(new SEnvAttr(key, value, this));
          return true;
        }
      });
    }

    getAttribute(name: string): string | null { 
      return this.hasAttribute(name) ? this.attributes[name].value : null;
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
      for (let i = 0, n = this.attributes.length; i < n; i++) {
        const { name, value } = this.attributes[i];
        buffer += ` ${name}="${value}"`;
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

    set innerHTML(value: string) {
      this.removeAllChildren();
      const documentFragment = evaluateHTMLDocumentFragment(value, this.ownerDocument);
      this.appendChild(documentFragment);
    }
    
    getElementsByTagName<K extends keyof ElementListTagNameMap>(name: K): ElementListTagNameMap[K];
    getElementsByTagName(name: string): NodeListOf<Element>{ 
      return null;
    }
    
    getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<any> { 
      return null;
    }
    
    hasAttribute(name: string): boolean { 
      return this.attributes[name] != null;
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
      if (this.hasAttribute(name)) {
        this.attributes[name] = value;
      } else {
        this.attributes.setNamedItem(new SEnvAttr(name, value, this));
      }
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

    cloneShallow() {
      const clone = this.ownerDocument.$createElementWithoutConstruct(this.tagName);
      for (let i = 0, n = this.attributes.length; i < n; i++) {
        const attr = this.attributes[i];
        clone.setAttribute(attr.name, attr.value);
      }
      return clone;
    }
  }
});

export const diffElementChild = (oldChild: SEnvNodeInterface, newChild: Node) => {
  switch(oldChild.nodeType) {
    case SEnvNodeTypes.ELEMENT: return diffElement(oldChild as any as SEnvElementInterface, newChild as any as SEnvElementInterface);
    case SEnvNodeTypes.TEXT: return diffTextNode(oldChild as any as Text, newChild as Text);
    case SEnvNodeTypes.COMMENT: return diffComment(oldChild as any as Comment, newChild as Comment);
  }
  return [];
};

const diffElement = (oldElement: SEnvElementInterface, newElement: SEnvElementInterface) => {
  const mutations = [];

  if (oldElement.nodeName !== newElement.nodeName) {
    throw new Error(`nodeName must match in order to diff`);
  }
  
  const attrDiff = diffArray(Array.from(oldElement.attributes), Array.from(newElement.attributes), (a, b) => a.name === b.name ? 1 : -1);
  
  eachArrayValueMutation(attrDiff, {
    insert: ({ index, value }) => {
      // this.setAttribute(value.name, value.value, undefined, index);
    },
    delete: ({ index }) => {
      // this.removeAttribute(oldElement.attributes[index].name);
    },
    update: ({ originalOldIndex, patchedOldIndex, newValue, index }) => {
      if(oldElement.attributes[originalOldIndex].value !== newValue.value) {
        // this.setAttribute(newValue.name, newValue.value, undefined, index);
      }
    }
  });

  mutations.push(...diffParentNode(oldElement, newElement, diffElementChild));
  return mutations;
};