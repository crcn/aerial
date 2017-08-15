import { difference } from "lodash";
import { DOMNodeType } from "./node-types";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { selectorMatchesElement } from "../selector";
import { syntheticElementClassType } from "./types";
import { SyntheticDocumentFragment } from "./document-fragment";
import { CallbackBus, IBus } from "mesh7";
import { SyntheticDOMNode, SyntheticDOMNodeSerializer } from "./node";
import { DOMEventListenerFunction } from "../events";
import { 
  DOMContainerEditor, 
  SyntheticDOMContainer, 
  isDOMContainerMutation, 
  SyntheticDOMContainerEdit, 
  SyntheticDOMContainerEditor,
  SyntheticDOMContainerMutationTypes, 
} from "./container";
import {
  bindable,
  Mutation,
  serialize,
  diffArray,
  Observable,
  deserialize,
  ITreeWalker,
  ISerializer,
  BoundingRect,
  serializable,
  ArrayMutation,
  MutationEvent,
  PropertyMutation,
  BubbleDispatcher,
  SetValueMutation,
  MoveChildMutation,
  InsertChildMutation,
  ObservableCollection,
  SerializedContentType,
} from "aerial-common";


import { Dependency } from "aerial-sandbox";
import {
  BaseContentEdit,
  ISyntheticObjectChild,
} from "aerial-sandbox";

export interface ISerializedSyntheticDOMAttribute {
  name: string;
  value: string;
  readonly: boolean;
}

export namespace SyntheticDOMElementMutationTypes {
  export const SET_ELEMENT_ATTRIBUTE_EDIT = "setElementAttributeEdit";
  export const ATTACH_SHADOW_ROOT_EDIT    = "attachShadowRootEdit";
}

export function isDOMElementMutation(mutation: Mutation<SyntheticDOMElement>) {
  return (mutation.target.nodeType === DOMNodeType.ELEMENT) && (!!{
    [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT]: true,
    [SyntheticDOMElementMutationTypes.ATTACH_SHADOW_ROOT_EDIT]: true
  }[mutation.type] || isDOMContainerMutation(mutation));
}

class SyntheticDOMAttributeSerializer implements ISerializer<SyntheticDOMAttribute, ISerializedSyntheticDOMAttribute> {
  serialize({ name, value, readonly }: SyntheticDOMAttribute) {
    return { name, value, readonly };
  }
  deserialize({ name, value, readonly }: ISerializedSyntheticDOMAttribute) {
    return new SyntheticDOMAttribute(name, value, readonly);
  }
}

@serializable("SyntheticDOMAttribute", new SyntheticDOMAttributeSerializer())
export class SyntheticDOMAttribute extends Observable implements ISyntheticObjectChild {

  @bindable(true)
  public value: any;
  readonly specified = true;

  constructor(readonly name: string, value: any, public readonly?: boolean) {
    super();
    this.value = value;
  }

  get uid() {
    return this.name;
  }

  toString() {
    return `${this.name}="${this.value}"`;
  }

  clone() {
    return new SyntheticDOMAttribute(this.name, this.value, this.readonly);
  }
}

export class SyntheticDOMAttributes extends ObservableCollection<SyntheticDOMAttribute> {
  splice(start: number, deleteCount: number = 0, ...items: SyntheticDOMAttribute[]) {
    for (let i = start, n = Math.min(start + deleteCount, this.length); i < n; i++) {
      const rmAttribute = this[i];
      // delete the attribute to ensure that hasOwnProperty returns false
      this[rmAttribute.name] = undefined
    }

    for (let i = 0, n = items.length; i < n; i++) {
      const newAttribute = items[i];
      this[newAttribute.name] = newAttribute;
    }

    return super.splice(start, deleteCount, ...items);
  }

  toObject(...only: string[]) {
    const ret = {};
    for (let i = 0, n = this.length; i < n; i++) {
      const attribute = this[i];
      if (only.length !== 0 && only.indexOf(attribute.name) === -1) {
        continue;
        }
      ret[attribute.name] = attribute.value;
    }
    return ret;
  }

  toString() {
    return this.map((attribute) => {
      return ` ${attribute}`;
    }).join("");
  }
}

export interface ISerializedSyntheticDOMElement {
  nodeName: string;
  namespaceURI: string;
  readonlyAttributeNames: string[];
  shadowRoot: SerializedContentType<any>;
  attributes: Array<SerializedContentType<ISerializedSyntheticDOMAttribute>>;
  childNodes: Array<SerializedContentType<any>>;
}

export class SyntheticDOMElementSerializer implements ISerializer<SyntheticDOMElement, ISerializedSyntheticDOMElement> {
  serialize({ nodeName, namespaceURI, shadowRoot, attributes, childNodes }: SyntheticDOMElement): any {
    return {
      nodeName,
      namespaceURI,
      shadowRoot: serialize(shadowRoot),
      attributes: [].concat(attributes).map(serialize),
      childNodes: [].concat(childNodes).map(serialize)
    };
  }
  deserialize({ nodeName, shadowRoot, namespaceURI, attributes, childNodes }, kernel, ctor) {
    const element = new ctor(namespaceURI, nodeName) as SyntheticDOMElement;

    for (let i = 0, n = attributes.length; i < n; i++) {
      element.attributes.push(<SyntheticDOMAttribute>deserialize(attributes[i], kernel));
    }

    for (let i = 0, n = childNodes.length; i < n; i++) {
      const child = <SyntheticDOMNode>deserialize(childNodes[i], kernel);
      element.appendChild(child);
    }

    const shadowRootFragment = deserialize(shadowRoot, kernel);
    if (shadowRootFragment) {
      element.attachShadow({ mode: "open" }).appendChild(shadowRootFragment);
    }

    // NOTE - $createdCallback is not called here for a reason -- serialized
    // must store the entire state of an object.
    return element;
  }
}

export class SyntheticDOMElementEdit extends SyntheticDOMContainerEdit<SyntheticDOMElement> {

  setAttribute(name: string, value: string, oldName?: string, index?: number) {
    return this.addChange(new PropertyMutation(SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT, this.target, name, value, undefined, oldName, index));
  }

  removeAttribute(name: string) {
    return this.setAttribute(name, undefined);
  }

  attachShadowRoot(shadowRoot: SyntheticDOMContainer) {
    this.addChange(new InsertChildMutation(SyntheticDOMElementMutationTypes.ATTACH_SHADOW_ROOT_EDIT, this.target, shadowRoot, Number.MAX_SAFE_INTEGER));
  }

  /**
   * Adds diff messages from the new element
   *
   * @param {SyntheticDOMElement} newElement
   */

  protected addDiff(newElement: SyntheticDOMElement) {

    if (this.target.nodeName !== newElement.nodeName) {
      throw new Error(`nodeName must match in order to diff`);
    }

    if (difference(this.target.readonlyAttributesNames, newElement.readonlyAttributesNames).length) {
      this.setAttribute("data-td-readonly", JSON.stringify(newElement.readonlyAttributesNames));
    }

    diffArray(this.target.attributes, newElement.attributes, (a, b) => a.name === b.name ? 1 : -1).accept({
      visitInsert: ({ index, value }) => {
        this.setAttribute(value.name, value.value, undefined, index);
      },
      visitRemove: ({ index }) => {
        this.removeAttribute(this.target.attributes[index].name);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, index }) => {
        if(this.target.attributes[originalOldIndex].value !== newValue.value) {
          this.setAttribute(newValue.name, newValue.value, undefined, index);
        }
      }
    });

    if (newElement.shadowRoot) {
      if (!this.target.shadowRoot) {
        this.attachShadowRoot(newElement.shadowRoot);
      } else {
        this.addChildEdit(this.target.shadowRoot.createEdit().fromDiff(newElement.shadowRoot));
      }
    }

    return super.addDiff(newElement);
  }
}

export class DOMElementEditor<T extends SyntheticDOMElement|HTMLElement> extends DOMContainerEditor<T>  {
  constructor(target: T, createNode?: (item: any) => any) {
    super(target, createNode);
  }

  applySingleMutation(mutation: Mutation<any>) {
    super.applySingleMutation(mutation);
    if (mutation.type === SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT) {
      const { name, oldName, newValue } = <PropertyMutation<any>>mutation;

      // need to set the current value (property), and the default value (attribute)
      // TODO - this may need to be separated later on.
      if (this.target.constructor.prototype.hasOwnProperty(name)) {
        this.target[name] = newValue == null ? "" : newValue;
      }

      if (newValue == null) {
        this.target.removeAttribute(name);
      } else {

        // An error will be thrown by the DOM if the name is invalid. Need to ignore
        // native exceptions so that other parts of the app do not break.
        try {
          this.target.setAttribute(name, newValue);
        } catch(e) {
          console.warn(e);
        }
      }

      if (oldName) {
        if (this.target.hasOwnProperty(oldName)) {
          this.target[oldName] = undefined;
        }

        this.target.removeAttribute(oldName);
      }
    }
  }
}

export class SyntheticDOMElementEditor<T extends SyntheticDOMElement> extends SyntheticDOMContainerEditor<T> {
  constructor(target: T) {
    super(target);
  }
  createDOMEditor(target: SyntheticDOMElement) {
    return new DOMElementEditor(target);
  }
  applySingleMutation(mutation: Mutation<any>) {
    if (mutation.type === SyntheticDOMElementMutationTypes.ATTACH_SHADOW_ROOT_EDIT) {
      const { child } = <InsertChildMutation<SyntheticDOMElement,SyntheticDOMContainer>>mutation;
      const shadowRoot = <SyntheticDOMContainer>child;

      this.target.$setShadowRoot(shadowRoot.cloneNode(true));
    }
  }
}

@serializable("SyntheticDOMElement", new SyntheticDOMNodeSerializer(new SyntheticDOMElementSerializer()))
export class SyntheticDOMElement extends SyntheticDOMContainer {

  // TODO - wire this up when front-end starts sending events to backend
  @bindable()
  public onclick: DOMEventListenerFunction;

  readonly nodeType: number = DOMNodeType.ELEMENT;
  readonly attributes: SyntheticDOMAttributes;
  readonly dataset: any;
  private _shadowRoot: SyntheticDocumentFragment;

  private _shadowRootObserver: IBus<any, any>;

  /**
   * Attributes that are not modifiable by the editor. These are typically
   * attributes that are dynamically created. For example:
   *
   * <div style={{color: computeColor(hash) }} />
   *
   */

  private _readonlyAttributeNames: string[];

  constructor(readonly namespaceURI: string, readonly tagName: string) {
    super(tagName);
    this._readonlyAttributeNames = [];
    this._shadowRootObserver = new BubbleDispatcher(this);
    this.attributes = new SyntheticDOMAttributes();
    this.attributes.observe(new CallbackBus(this.onAttributesEvent.bind(this)));

    // todo - proxy this
    this.dataset = {};
  }

  createEdit() {
    return new SyntheticDOMElementEdit(this);
  }

  createEditor() {
    return new SyntheticDOMElementEditor(this);
  }

  visitWalker(walker: ITreeWalker) {
    if (this.shadowRoot) walker.accept(this.shadowRoot);
    super.visitWalker(walker);
  }

  getAttribute(name: string) {
    return this.hasAttribute(name) ? this.attributes[name].value : null;
  }

  getAttributeNode(name: string) {
    return this.hasAttribute(name) ? this.attributes[name] : null;
  }

  hasAttribute(name: string) {

    // better than checking property since prop check may
    // be prototype of array
    return !!this.attributes.find((attrib) => attrib.name === name);
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitElement(this);
  }

  get readonlyAttributesNames() {
    return this._readonlyAttributeNames;
  }

  createShadowRoot() {
    return this.attachShadow({ mode: "open" });
  }

  attachShadow({ mode }: { mode: "open"|"close" }) {
    if (this._shadowRoot) return this._shadowRoot;
    return this.$setShadowRoot(new SyntheticDocumentFragment());
  }

  $setShadowRoot(shadowRoot: SyntheticDocumentFragment) {
    if (this._shadowRoot) {
      this._shadowRoot.unobserve(this._shadowRootObserver);
    }

    this._shadowRoot = shadowRoot;
    this._shadowRoot.$setOwnerDocument(this.ownerDocument);
    this._shadowRoot.observe(new BubbleDispatcher(this));
    return this._shadowRoot;
  }

  get shadowRoot(): SyntheticDocumentFragment {
    return this._shadowRoot;
  }

  get id() {
    return this.getAttribute("id");
  }

  set id(value: string) {
    this.setAttribute("id", value);
  }

  matches(selector) {
    return selectorMatchesElement(selector, this);
  }

  setAttribute(name: string, value: string) {

    // attributes that are not editable by the editor
    if (name === "data-td-readonly") {
      this._readonlyAttributeNames = JSON.parse(value) as string[];
      return this._resetReadonlyAttributes();
    }

    // Reserved attribute to help map where this element came from. Defined
    // by source transformers that scan for HTML elements.
    if (name === "data-td-source") {
      this.$source = JSON.parse(value);
      return;
    }

    let oldValue;
    const attribute = this.getAttributeNode(name);
    if (attribute) {
      attribute.value = value;
    } else {
      this.attributes.push(new SyntheticDOMAttribute(name, value, this._readonlyAttributeNames.indexOf(name) !== -1));
    }
  }

  private _resetReadonlyAttributes() {
    for (const attribute of this.attributes) {
      attribute.readonly = false;
    }

    for (const attributeName of this._readonlyAttributeNames) {
      const attribute = this.attributes[attributeName] as SyntheticDOMAttribute;
      if (attribute) attribute.readonly = true;
    }
  }

  removeAttribute(name: string) {
    if (this.hasAttribute(name)) {
      const attribute = this.attributes[name];
      this.attributes.splice(this.attributes.indexOf(attribute), 1);
    }
  }

  toString(): string {
    return [
      "<",
      this.nodeName,
      this.attributes,
      ">",
      this.childNodes.map((child) => child.toString()).join(""),
      "</",
      this.nodeName,
      ">"
    ].join("");
  }


  protected onAttributesEvent({ mutation }: MutationEvent<any>) {
    if (!mutation) return;
    
    if (mutation.type === ArrayMutation.ARRAY_DIFF) {
      (<ArrayMutation<SyntheticDOMAttribute>><any>mutation).accept({
        visitUpdate: () => {},
        visitInsert: ({ value, index }) => {
          this.attributeChangedCallback(value.name, undefined, value.value);
        },
        visitRemove: ({ value, index }) => {
          this.attributeChangedCallback(value.name, value.value, undefined);
        }
      });
    } else if (mutation.type === PropertyMutation.PROPERTY_CHANGE && mutation.target instanceof SyntheticDOMAttribute) {
      const changeMutation = <PropertyMutation<any>>mutation;
      const attribute = <SyntheticDOMAttribute>mutation.target;
      this.attributeChangedCallback(attribute.name, changeMutation.oldValue, changeMutation.newValue);
    }
  }


  $setOwnerDocument(document: SyntheticDocument) {
    super.$setOwnerDocument(document);
    if (this._shadowRoot) {
      this._shadowRoot.$setOwnerDocument(document);
    }
  }

  $attach(document: SyntheticDocument) {
    super.$attach(document);
    if (this._shadowRoot) {
      this._shadowRoot.$attach(document);
    }
  }


  $detach() {
    super.$detach();
    if (this._shadowRoot) {
      this._shadowRoot.$detach();
    }
  }

  protected attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    this.notify(new PropertyMutation(SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT, this, name, newValue, oldValue).toEvent(true));
  }

  protected cloneShallow() {
    const constructor = this.constructor as syntheticElementClassType;
    const clone = new constructor(this.namespaceURI, this.tagName);
    for (const attribute of this.attributes) {
      clone.setAttribute(attribute.name, attribute.value);
    }
    return clone;
  }
}