import { SEnvNodeTypes } from "../constants";
import { constructNode } from "./utils";
import { getSEnvEventClasses } from "../events";
import { SEnvWindowInterface } from "../window";
import { SEnvDocumentInterface } from "./document";
import { getDOMExceptionClasses } from "./exceptions";
import { getSEnvEventTargetClass, SEnvMutationEventInterface } from "../events";
import { getSEnvNamedNodeMapClass } from "./named-node-map";
import { getSEnvHTMLCollectionClasses, SEnvNodeListInterface } from "./collections";
import { 
  weakMemo, 
  Mutation, 
  SetValueMutation,
  generateDefaultId, 
  ExpressionLocation, 
  createSetValueMutation, 
  createPropertyMutation,
} from "aerial-common2";
import { SyntheticNode, SyntheticValueNode } from "../../state";

export interface SEnvNodeInterface extends Node {
  uid: string;
  $$id: string;
  structType: string;
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
  const { SEnvMutationEvent } =  getSEnvEventClasses(context);

  return class SEnvNode extends SEnvEventTarget implements SEnvNodeInterface {

    public $$parentNode: Node;
    public $$parentElement: HTMLElement;
    public $$type: string;
    public $$id: string;
    public contentLoaded: Promise<any>;
    public interactiveLoaded: Promise<any>;
    public source: any;
    private _struct: SyntheticNode;
    private _constructed: boolean;
    readonly constructNode: boolean;
    readonly structType: string;

    readonly attributes: NamedNodeMap;
    readonly baseURI: string | null;
    childNodes: NodeList;
    readonly localName: string | null;
    readonly namespaceURI: string | null;
    readonly nodeName: string;
    readonly nodeType: number;
    nodeValue: string | null;
    readonly ownerDocument: SEnvDocumentInterface;
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
    uid: string;
    childNodesArray: Node[];

    connectedToDocument: boolean;


    constructor() {
      super();

      // called specifically for elements
      if (this._constructed) {
        throw new Error(`Cannot call constructor twice.`);
      }
      this._constructed = true;
      this.addEventListener(SEnvMutationEvent.MUTATION, this._onMutation.bind(this));
    }

    $$preconstruct() {
      super.$$preconstruct();
      this.uid = this.$$id = generateDefaultId();
      this.childNodes = this.childNodesArray = new SEnvNodeList();
    }

    get nextSibling() {
      return this.parentNode.childNodes[Array.prototype.indexOf.call(this.parentNode.childNodes, this) + 1];
    }

    get previousSibling() {
      return this.parentNode.childNodes[Array.prototype.indexOf.call(this.parentNode.childNodes, this) - 1];
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

    get struct(): SyntheticNode {
      if (!this._struct) {
        this.updateStruct();
      }
      return this._struct;
    }

    protected updateStruct() {
      this._struct = this.createStruct();
    }

    protected createStruct(): SyntheticNode {
      return {
        nodeType: this.nodeType,
        nodeName: this.nodeName,
        source: this.source,
        $$type: this.structType,
        $$id: this.uid
      };
    }

    appendChild<T extends Node>(newChild: T): T {
      this._throwUnsupportedMethod();
      return null;
    }

    cloneNode(deep?: boolean): Node {
      const clone = this.cloneShallow();
      clone.source = this.source;
      clone.uid    = clone.$$id = this.uid;

      if (deep !== false) {
        for (let i = 0, n = this.childNodes.length; i < n; i++) {
          clone.appendChild(this.childNodes[i].cloneNode(true));
        }
      }
      if (this.constructNode) {
        constructNode(clone);
      }
      return clone;
    }

    cloneShallow(): SEnvNodeInterface {
      this._throwUnsupportedMethod();
      return null;
    }

    compareDocumentPosition(other: Node): number {
      return 0;
    }

    contains(child: Node): boolean {
      return Array.prototype.indexOf.call(this.childNodes, child) !== -1;
    }
    
    remove() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
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

    protected _onMutation(event: SEnvMutationEventInterface) {
      this._struct = null;
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
      this._defaultView.childObjects.set(this.uid, this);
    }

    private get _defaultView() {
      return this.nodeType === SEnvNodeTypes.DOCUMENT ? (this as any as SEnvDocumentInterface).defaultView : this.ownerDocument.defaultView as SEnvWindowInterface;
    }

    $$removedFromDocument() {
      this.connectedToDocument = false;
      this._defaultView.childObjects.delete(this.uid);
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

export const getSEnvValueNode = weakMemo((context) => {
  const SEnvNode = getSEnvNodeClass(context);
  const { SEnvMutationEvent } = getSEnvEventClasses(context);
  

  return class SenvValueNode extends SEnvNode {
    constructor(private _nodeValue: string)  {
      super();
    }

    get nodeValue() {
      return this._nodeValue;
    }

    createStruct(): SyntheticValueNode {
      return {
        ...(super.createStruct() as any),
        nodeValue: this._nodeValue
      }
    }

    set nodeValue(value: string) {
      this._nodeValue = value;
      const e = new SEnvMutationEvent();
      e.initMutationEvent(createPropertyMutation(UPDATE_VALUE_NODE, this, "nodeValue", value, undefined));
      this.dispatchEvent(e);
    }
  }
});

export const UPDATE_VALUE_NODE = "UPDATE_VALUE_NODE";

export const createUpdateValueNodeMutation = (oldNode: SyntheticValueNode, newValue: string) => {
  return createSetValueMutation(UPDATE_VALUE_NODE, oldNode, newValue);
};

export const diffValueNode = (oldNode: SyntheticValueNode, newNode: SyntheticValueNode) => {
  const mutations = [];
  if(oldNode.nodeValue !== newNode.nodeValue) {
    mutations.push(createUpdateValueNodeMutation(oldNode, newNode.nodeValue));
  }
  return mutations;
};

export const patchValueNode = (oldNode: Text|Comment, mutation: Mutation<any>) => {
  if (mutation.$$type === UPDATE_VALUE_NODE) {
    oldNode.nodeValue = (mutation as SetValueMutation<any>).newValue;
  }
};