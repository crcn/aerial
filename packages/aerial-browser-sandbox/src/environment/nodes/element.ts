import { diffComment } from "./comment";
import { difference } from "lodash";
import { diffTextNode } from "./text";
import { SEnvNodeTypes } from "../constants";
import { weakMemo, diffArray, eachArrayValueMutation, Mutation, createPropertyMutation, SetPropertyMutation } from "aerial-common2";
import { getSEnvParentNodeClass, diffParentNode, SEnvParentNodeInterface, patchParentNode } from "./parent-node";
import { getSEnvEventClasses } from "../events";
import { evaluateHTMLDocumentFragment, constructNode } from "./utils";
import { getSEnvHTMLCollectionClasses, SEnvNodeListInterface } from "./collections";
import { getSEnvNodeClass, SEnvNodeInterface } from "./node";
import { SyntheticElement, SYNTHETIC_ELEMENT, SyntheticAttribute, SyntheticNode, SyntheticTextNode, SyntheticComment, BasicNode, BasicElement, BasicAttribute, BasicValueNode, BasicComment, BasicTextNode } from "../../state";

export const getSEnvAttr = weakMemo((context: any) => {
  const SEnvNode = getSEnvNodeClass(context);
  return class SEnvAttr extends SEnvNode implements Attr {
    readonly prefix: string | null;
    readonly specified: boolean;
    constructor(readonly name: string, public value: string, readonly ownerElement: Element) {
      super();
    }
    createStruct(): SyntheticAttribute {
      return {
        ...(super.createStruct() as any),
        name: this.name,
        value: this.value
      };
    }
  }
});

export interface SEnvElementInterface extends SEnvParentNodeInterface, Element {
  $$preconstruct();
  childNodes: SEnvNodeListInterface;
  addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
}

export const getSEnvElementClass = weakMemo((context: any) => {
  const SEnvAttr = getSEnvAttr(context);
  const SEnvNode = getSEnvNodeClass(context);
  const SEnvParentNode = getSEnvParentNodeClass(context);
  const { SEnvNamedNodeMap } = getSEnvHTMLCollectionClasses(context);
  const { SEnvMutationEvent } = getSEnvEventClasses(context);

  return class SEnvElement extends SEnvParentNode implements SEnvElementInterface {

    readonly classList: DOMTokenList;
    className: string;
    readonly clientHeight: number;
    readonly clientLeft: number;
    readonly clientTop: number;
    readonly clientWidth: number;
    constructClone: boolean;
    readonly structType: string = SYNTHETIC_ELEMENT;
    attributes: NamedNodeMap;
    nodeType: number = SEnvNodeTypes.ELEMENT;

    msContentZoomFactor: number;
    readonly msRegionOverflow: string;
    readonly addedNodes: NodeList;
    readonly oldValue: string | null;
    readonly removedNodes: NodeList;
    readonly nextElementSibling: Element | null;
    readonly previousElementSibling: Element | null;
    readonly type: string;
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
      this.constructClone = true;
      this.nodeType = SEnvNodeTypes.ELEMENT;

      this.attributes = new Proxy(new SEnvNamedNodeMap(), {
        get: (target: NamedNodeMap, key: string)  => {
          return typeof target[key] === "function" ? target[key].bind(target) : target[key];
        },
        set: (target, key: string, value: string, receiver)  => {
          const oldItem = target.getNamedItem(value);
          if (value == null) {
            target.removeNamedItem(key);
          } else {
            target.setNamedItem(new SEnvAttr(key, value, this));
          }
          this.attributeChangedCallback(key, oldItem && oldItem.value, value);
          return true;
        }
      });
    }

    get id() {
      return this.getAttribute("id");
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
      return this.ownerDocument.defaultView.renderer.getBoundingClientRect(this);
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
      const documentFragment = evaluateHTMLDocumentFragment(value, this.ownerDocument, this);
    }

    createStruct(parentNode?: SEnvNodeInterface): SyntheticElement {
      return {
        ...(super.createStruct(parentNode) as any),
        attributes: Array.prototype.map.call(this.attributes, attr => attr.struct)
      };
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
      this.attributes[qualifiedName] = undefined;
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
      this.attributes[name] = value;
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


    protected attributeChangedCallback(name: string, oldValue: any, newValue: any) {
      const e = new SEnvMutationEvent();
      e.initMutationEvent(createPropertyMutation(SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT, this, name, newValue, oldValue));
      this.dispatchEvent(e);
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

export const diffElementChild = (oldChild: Node, newChild: Node) => {
  switch(oldChild.nodeType) {
    case SEnvNodeTypes.ELEMENT: return diffElement(oldChild as Element, newChild as Element);
    case SEnvNodeTypes.TEXT: return diffTextNode(oldChild as Text, newChild as Text);
    case SEnvNodeTypes.COMMENT: return diffComment(oldChild as Comment, newChild as Comment);
  }
  return [];
};

export namespace SyntheticDOMElementMutationTypes {
  export const SET_ELEMENT_ATTRIBUTE_EDIT = "setElementAttributeEdit";
  export const ATTACH_SHADOW_ROOT_EDIT    = "attachShadowRootEdit";
  export const SET_TEXT_CONTENT    = "setTextContent";
}

export const createSetElementTextContentMutation = (target: BasicElement, value: string) => {
  return createPropertyMutation(SyntheticDOMElementMutationTypes.SET_TEXT_CONTENT, target, "textContent", value);
}

export const createSetElementAttributeMutation = (target: Element, name: string, value: string, oldName?: string, index?: number) => {
  return createPropertyMutation(SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT, target, name, value, undefined, oldName, index);
}

export const diffElement = (oldElement: Element, newElement: Element) => {
  const mutations = [];

  if (oldElement.nodeName !== newElement.nodeName) {
    throw new Error(`nodeName must match in order to diff`);
  }
  
  const attrDiff = diffArray(Array.from(oldElement.attributes), Array.from(newElement.attributes), (a, b) => a.name === b.name ? 1 : -1);
  
  eachArrayValueMutation(attrDiff, {
    insert: ({ index, value }) => {
      mutations.push(createSetElementAttributeMutation(oldElement, value.name, value.value, undefined, index));
    },
    delete: ({ index }) => {
      mutations.push(createSetElementAttributeMutation(oldElement, oldElement.attributes[index].name, undefined));
    },
    update: ({ originalOldIndex, patchedOldIndex, newValue, index }) => {
      if(oldElement.attributes[originalOldIndex].value !== newValue.value) {
        mutations.push(createSetElementAttributeMutation(oldElement, newValue.name, newValue.value, undefined, index));
      }
    }
  });

  mutations.push(...diffParentNode(oldElement, newElement, diffElementChild));
  return mutations;
};

export const patchElement = (oldElement: Element, mutation: Mutation<any>) => {
  if (mutation.$type === SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT) {
    

    const { name, oldName, newValue } = <SetPropertyMutation<any>>mutation;

    // need to set the current value (property), and the default value (attribute)
    // TODO - this may need to be separated later on.
    if (oldElement.constructor.prototype.hasOwnProperty(name)) {

      oldElement[name] = newValue == null ? "" : newValue;
    }

    if (newValue == null) {
      oldElement.removeAttribute(name);
    } else {

      // An error will be thrown by the DOM if the name is invalid. Need to ignore
      // native exceptions so that other parts of the app do not break.
      try {

        oldElement.setAttribute(name, newValue);
      } catch(e) {
        console.warn(e);
      }
    }

    if (oldName) {
      if (oldElement.hasOwnProperty(oldName)) {
        oldElement[oldName] = undefined;
      }

      oldElement.removeAttribute(oldName);
    }
  } else {
    patchParentNode(oldElement, mutation);
  }
};