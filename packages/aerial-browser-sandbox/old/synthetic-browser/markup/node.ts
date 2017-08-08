import assert = require("assert");
import { DOMNodeType } from "./node-types";
import {BaseContentEdit } from "aerial-sandbox";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";

import { SyntheticDOMElement } from "./element";
import { SyntheticDOMContainer } from "./container";
import {
  IEditor,
  IEditable,
  IDiffable,
  BaseEditor,
  Dependency,
  SandboxModule,
  SyntheticObjectEdit,
  ISyntheticObject,
  ISyntheticSourceInfo,
  SyntheticObjectEditor,
  generateSyntheticUID,
  SyntheticObjectSerializer,
 } from "aerial-sandbox";

import { DOMEventDispatcherMap } from "../events";

import {
  Mutation,
  TreeNode,
  Metadata,
  serialize,
  CoreEvent,
  ITreeWalker,
  deserialize,
  ISerializer,
  IComparable,
  findTreeNode,
  serializable,
  BubbleDispatcher,
} from "aerial-common";

export interface ISerializedSyntheticDOMNode {
  source: ISyntheticSourceInfo;
  uid: any;
}

export const SyntheticDOMNodeSerializer = SyntheticObjectSerializer;

export abstract class SyntheticDOMNodeEdit<T extends SyntheticDOMNode> extends SyntheticObjectEdit<T> { }
export class SyntheticDOMNodeEditor<T extends SyntheticDOMNode> extends SyntheticObjectEditor<T> { }

// TODO - possibly have metadata here since it's generic and can be used with any synthetic
export abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISyntheticObject, IEditable {

  readonly metadata: Metadata;

  abstract textContent: string;
  readonly namespaceURI: string;
  public $uid: any;
  protected _attached: boolean;
  private _attachedBeforeCreatedCallback: boolean;
  public loaded: Promise<any>;

  /**
   * Bool check to ensure that createdCallback doesn't get called twice accidentally
   */

  private _createdCallbackCalled: boolean;

  /**
   * TRUE if the node has been loaded
   */

  private _ownerDocument: SyntheticDocument;

  /**
   * @type {Node}
   */

  protected _native: Node;

  /**
   */

  public $source: ISyntheticSourceInfo;

  /**
   * The DOM node type
   */

  abstract readonly nodeType: number;

  /**
   * Only set if the synthetic DOM node is running in a sandbox -- not always
   * the case especially with serialization.
   */

  public $module: SandboxModule;

  private _eventDispatcher: DOMEventDispatcherMap;


  constructor(readonly nodeName: string) {
    super();
    this.regenerateUID();
    this.metadata = new Metadata(this.getInitialMetadata());
    this.metadata.observe(new BubbleDispatcher(this));
  }

  protected get eventDispatcher() {
    return this._eventDispatcher || (this._eventDispatcher = new DOMEventDispatcherMap(this));
  }

  // necessary after cloning
  regenerateUID() {
    this.$uid = generateSyntheticUID();
    for (let i = this.children.length; i--;) {
      this.children[i].regenerateUID();
    }
    return this;
  }

  get uid(): any {
    return this.$uid;
  }

  get ownerDocument(): SyntheticDocument {
    return this._ownerDocument;
  }

  get source(): ISyntheticSourceInfo {
    return this.$source;
  }

  // get browser(): ISyntheticBrowser {
  //   // return this.ownerDocument.defaultView.browser;
  // }

  get module() {
    return this.$module;
  }

  get childNodes() {
    return this.children;
  }

  get parentElement(): SyntheticDOMElement {
    const parent = this.parentNode;
    if (!parent || parent.nodeType !== DOMNodeType.ELEMENT) {

      // NULL is standard here, otherwise undefined would be a better option.
      return null;
    }
    return parent as any as SyntheticDOMElement;
  }

  get parentNode(): SyntheticDOMContainer {
    return this.parent as SyntheticDOMContainer;
  }

  addEventListener(type: string, listener: (event: CoreEvent) => any) {
    this.eventDispatcher.add(type, listener);
  }

  removeEventListener(type: string, listener: (event: CoreEvent) => any) {
    this.eventDispatcher.remove(type, listener);
  }

  dispatchEvent(event: CoreEvent) {
    this.notify(event);
  }

  contains(node: SyntheticDOMNode) {
    return !!findTreeNode(this, child => child === node);
  }

  /**
   * TODO - change this method name to something such as computeDifference
   *
   * @param {SyntheticDOMNode<any>} source
   * @returns
   */

  compare(source: SyntheticDOMNode) {
    return Number(source.constructor === this.constructor && this.nodeName === source.nodeName);
  }

  isEqualNode(node: SyntheticDOMNode) {
    return !!this.compare(node);
  }

  protected getInitialMetadata() {
    return {};
  }

  isSameNode(node: SyntheticDOMNode) {
    return this === node;
  }

  /**
   * Attaches a native DOM node. TODO - possibly
   * change this to addProduct since the renderer can attach anything
   * that it wants -- even non-native elements that share an identical
   * API.
   *
   * @param {Node} node
   */

  attachNative(node: Node) {
    this._native = node;
  }

  get mountedToNative() {
    return this._native;
  }

  hasChildNodes() {
    return this.childNodes.length !== 0;
  }

  onChildAdded(child: SyntheticDOMNode, index: number) {

    // must come before super to ensure that ownerDocument is present
    // if mutation listeners look for it.
    child.$setOwnerDocument(this.ownerDocument);
    super.onChildAdded(child, index);
    if (this.ownerDocument) {
      if (this._attached) {
        child.$attach(this.ownerDocument);
      } else if (child._attached) {
        child.$detach();
      }
    }
  }

  onChildRemoved(child: SyntheticDOMNode, index: number) {
    super.onChildRemoved(child, index);
    if (this._attached) {
      child.$detach();
    }
  }

  $setOwnerDocument(document: SyntheticDocument) {
    this._ownerDocument = document;
    for (let i = 0, n = this.childNodes.length; i < n; i++) {
      this.childNodes[i].$setOwnerDocument(document);
    }
  }

  $createdCallback() {

    if (this._createdCallbackCalled) {
      throw new Error(`createdCallback() has already been called.`);
    }

    this._createdCallbackCalled = true;
    this.createdCallback();
    
    if (this._attachedBeforeCreatedCallback) {
      this.$attachedCallback();
    }
  }

  protected createdCallback() {

  }


  $attach(document: SyntheticDocument) {

    if (this._attached && this._ownerDocument === document) {
      return console.warn("Trying to attach an already attached node");
    }
    this._attached = true;

    this._ownerDocument = document;
    this.$attachedCallback();

    for (let i = 0, n = this.childNodes.length; i < n; i++) {
      this.childNodes[i].$attach(document);
    }
  }

  protected $attachedCallback() {

    // this will happen during the loading phase of the document
    if (!this._createdCallbackCalled) {
      this._attachedBeforeCreatedCallback = true;
      return;
    }

    this.attachedCallback();
  }

  $detach() {
    if (!this._attached) return;
    this._attached = false;
    this.detachedCallback();
    for (let i = 0, n = this.childNodes.length; i < n; i++) {
      this.childNodes[i].$detach();
    }
  }

  public $linkClone(clone: SyntheticDOMNode) {
    clone.$source = this.$source;
    clone.$module = this.$module;
    clone.$uid    = this.uid;
    clone.$setOwnerDocument(this.ownerDocument);
    return clone;
  }

  protected attachedCallback() { }
  protected detachedCallback() { }

  /**
   * Clone alias for standard DOM API. Note that there's a slight difference
   * with how these work -- cloneNode for the DOM calls createdCallback on elements. Whereas
   * cloneNode in this context doesn't. Instead cloneNode here serializes & deserializes the node -- reloading
   * the exact state of the object
   *
   * @param {boolean} [deep]
   * @returns
   */

  cloneNode(deep?: boolean) {
    return this.clone(deep);
  }

  abstract accept(visitor: IMarkupNodeVisitor);
  clone(deep?: boolean) {
    if (deep) return deserialize(serialize(this), undefined);
    return this.$linkClone(this.cloneShallow());
  }

  protected abstract cloneShallow();
  abstract createEdit(): BaseContentEdit<any>;
  createEditor(): IEditor {
    return new SyntheticDOMNodeEditor(this);
  }
}
