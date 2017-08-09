import { weakMemo, ExpressionLocation } from "aerial-common2";
import { SEnvDocumentInterface } from "./document";
import { getDOMExceptionClasses } from "./exceptions";
import { getSEnvEventTargetClass } from "../events";
import { getSEnvNamedNodeMapClass } from "./named-node-map";
import { getSEnvHTMLCollectionClasses } from "./collections";

export interface SEnvNodeInterface extends Node {
  source: ExpressionLocation;
  contentLoaded: Promise<any>;
  interactiveLoaded: Promise<any>;
  connectedToDocument: boolean;
  $$parentNode: Node;
  $$parentElement: HTMLElement;
  $$addedToDocument();
  $$removedFromDocument();
  $$preconstruct();
};

export const getSEnvNodeClass = weakMemo((context: any) => {
  
  const SEnvEventTarget = getSEnvEventTargetClass(context);
  const SEnvNamedNodeMap = getSEnvNamedNodeMapClass(context);
  const { SEnvNodeList } =  getSEnvHTMLCollectionClasses(context);
  const { SEnvDOMException } =  getDOMExceptionClasses(context);

  return class SEnvNode extends SEnvEventTarget implements SEnvNodeInterface {

    public $$parentNode: Node;
    public $$parentElement: HTMLElement;
    public contentLoaded: Promise<any>;
    public interactiveLoaded: Promise<any>;
    public source: any;

    readonly attributes: NamedNodeMap;
    readonly baseURI: string | null;
    childNodes: NodeList;
    readonly localName: string | null;
    readonly namespaceURI: string | null;
    readonly nextSibling: Node | null;
    readonly nodeName: string;
    readonly nodeType: number;
    nodeValue: string | null;
    readonly ownerDocument: SEnvDocumentInterface;
    readonly previousSibling: Node | null;
    textContent: string | null;
    readonly ATTRIBUTE_NODE: number;
    readonly CDATA_SECTION_NODE: number;
    readonly COMMENT_NODE: number;
    readonly DOCUMENT_FRAGMENT_NODE: number;
    readonly DOCUMENT_NODE: number;
    readonly DOCUMENT_POSITION_CONTAINED_BY: number;
    readonly DOCUMENT_POSITION_CONTAINS: number;
    readonly DOCUMENT_POSITION_DISCONNECTED: number;
    readonly DOCUMENT_POSITION_FOLLOWING: number;
    readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
    readonly DOCUMENT_POSITION_PRECEDING: number;
    readonly DOCUMENT_TYPE_NODE: number;
    readonly ELEMENT_NODE: number;
    readonly ENTITY_NODE: number;
    readonly ENTITY_REFERENCE_NODE: number;
    readonly NOTATION_NODE: number;
    readonly PROCESSING_INSTRUCTION_NODE: number;
    readonly TEXT_NODE: number;

    connectedToDocument: boolean;

    protected $childNodesArray: Node[];

    $$preconstruct() {
      super.$$preconstruct();
      this.childNodes = this.$childNodesArray = new SEnvNodeList();
    }

    get parentNode() {
      return this.$$parentNode;
    }

    get parentElement() {
      return this.$$parentElement;
    }

    get firstChild() {
      return this.childNodes[0];
    }

    get lastChild() {
      return this.childNodes[this.childNodes.length - 1];
    }

    appendChild<T extends Node>(newChild: T): T {
      this._throwUnsupportedMethod();
      return null;
    }

    cloneNode(deep?: boolean): Node {
      this._throwUnsupportedMethod();
      return null;
    }

    compareDocumentPosition(other: Node): number {
      return 0;
    }

    contains(child: Node): boolean {
      return false;
    }
    

    hasAttributes(): boolean {
      return this.attributes.length > 0;
    }

    hasChildNodes(): boolean {
      return this.childNodes.length > 0;
    }

    insertBefore<T extends Node>(newChild: T, refChild: Node | null): T {
      this._throwUnsupportedMethod();
      return null;
    }
    isDefaultNamespace(namespaceURI: string | null): boolean {
      return false;
    }

    isEqualNode(arg: Node): boolean {
      return false;
    }

    isSameNode(other: Node): boolean {
      return false;
    }

    lookupNamespaceURI(prefix: string | null): string | null {
      return null;
    }

    lookupPrefix(namespaceURI: string | null): string | null {
      return null;
    }

    normalize(): void { }

    removeChild<T extends Node>(oldChild: T): T {
      this._throwUnsupportedMethod();
      return null;
    }

    protected connectedCallback() {

    }

    replaceChild<T extends Node>(newChild: Node, oldChild: T): T {
      this._throwUnsupportedMethod();
      return null;
    }

    protected _throwUnsupportedMethod() {
      throw new SEnvDOMException("This node type does not support this method.");
    }

    $$addedToDocument() {
      this.connectedToDocument = true;
      this.connectedCallback();
    }

    $$removedFromDocument() {
      this.connectedToDocument = false;
    }

    dispatchEvent(event: Event): boolean {
      super.dispatchEvent(event);
      if (event.bubbles && this.parentNode) {
        this.parentNode.dispatchEvent(event);
      }
      return true;
    }
  }
});
