import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocumentFragment } from "./document-fragment";
import { DOMEventListenerFunction } from "../events";
import { DOMContainerEditor, SyntheticDOMContainer, SyntheticDOMContainerEdit, SyntheticDOMContainerEditor } from "./container";
import { Mutation, Observable, ITreeWalker, ISerializer, MutationEvent, PropertyMutation, ObservableCollection, SerializedContentType } from "aerial-common";
import { ISyntheticObjectChild } from "aerial-sandbox";
export interface ISerializedSyntheticDOMAttribute {
    name: string;
    value: string;
    readonly: boolean;
}
export declare namespace SyntheticDOMElementMutationTypes {
    const SET_ELEMENT_ATTRIBUTE_EDIT = "setElementAttributeEdit";
    const ATTACH_SHADOW_ROOT_EDIT = "attachShadowRootEdit";
}
export declare function isDOMElementMutation(mutation: Mutation<SyntheticDOMElement>): boolean;
export declare class SyntheticDOMAttribute extends Observable implements ISyntheticObjectChild {
    readonly name: string;
    readonly: boolean;
    value: any;
    readonly specified: boolean;
    constructor(name: string, value: any, readonly?: boolean);
    readonly uid: string;
    toString(): string;
    clone(): SyntheticDOMAttribute;
}
export declare class SyntheticDOMAttributes extends ObservableCollection<SyntheticDOMAttribute> {
    splice(start: number, deleteCount?: number, ...items: SyntheticDOMAttribute[]): SyntheticDOMAttribute[];
    toObject(...only: string[]): {};
    toString(): string;
}
export interface ISerializedSyntheticDOMElement {
    nodeName: string;
    namespaceURI: string;
    readonlyAttributeNames: string[];
    shadowRoot: SerializedContentType<any>;
    attributes: Array<SerializedContentType<ISerializedSyntheticDOMAttribute>>;
    childNodes: Array<SerializedContentType<any>>;
}
export declare class SyntheticDOMElementSerializer implements ISerializer<SyntheticDOMElement, ISerializedSyntheticDOMElement> {
    serialize({nodeName, namespaceURI, shadowRoot, attributes, childNodes}: SyntheticDOMElement): any;
    deserialize({nodeName, shadowRoot, namespaceURI, attributes, childNodes}: {
        nodeName: any;
        shadowRoot: any;
        namespaceURI: any;
        attributes: any;
        childNodes: any;
    }, kernel: any, ctor: any): SyntheticDOMElement;
}
export declare class SyntheticDOMElementEdit extends SyntheticDOMContainerEdit<SyntheticDOMElement> {
    setAttribute(name: string, value: string, oldName?: string, index?: number): PropertyMutation<SyntheticDOMElement>;
    removeAttribute(name: string): PropertyMutation<SyntheticDOMElement>;
    attachShadowRoot(shadowRoot: SyntheticDOMContainer): void;
    /**
     * Adds diff messages from the new element
     *
     * @param {SyntheticDOMElement} newElement
     */
    protected addDiff(newElement: SyntheticDOMElement): any;
}
export declare class DOMElementEditor<T extends SyntheticDOMElement | HTMLElement> extends DOMContainerEditor<T> {
    constructor(target: T, createNode?: (item: any) => any);
    applySingleMutation(mutation: Mutation<any>): void;
}
export declare class SyntheticDOMElementEditor<T extends SyntheticDOMElement> extends SyntheticDOMContainerEditor<T> {
    constructor(target: T);
    createDOMEditor(target: SyntheticDOMElement): DOMElementEditor<SyntheticDOMElement>;
    applySingleMutation(mutation: Mutation<any>): void;
}
export declare class SyntheticDOMElement extends SyntheticDOMContainer {
    readonly namespaceURI: string;
    readonly tagName: string;
    onclick: DOMEventListenerFunction;
    readonly nodeType: number;
    readonly attributes: SyntheticDOMAttributes;
    readonly dataset: any;
    private _shadowRoot;
    private _shadowRootObserver;
    /**
     * Attributes that are not modifiable by the editor. These are typically
     * attributes that are dynamically created. For example:
     *
     * <div style={{color: computeColor(hash) }} />
     *
     */
    private _readonlyAttributeNames;
    constructor(namespaceURI: string, tagName: string);
    createEdit(): SyntheticDOMElementEdit;
    createEditor(): SyntheticDOMElementEditor<this>;
    visitWalker(walker: ITreeWalker): void;
    getAttribute(name: string): any;
    getAttributeNode(name: string): any;
    hasAttribute(name: string): boolean;
    accept(visitor: IMarkupNodeVisitor): any;
    readonly readonlyAttributesNames: string[];
    createShadowRoot(): SyntheticDocumentFragment;
    attachShadow({mode}: {
        mode: "open" | "close";
    }): SyntheticDocumentFragment;
    $setShadowRoot(shadowRoot: SyntheticDocumentFragment): SyntheticDocumentFragment;
    readonly shadowRoot: SyntheticDocumentFragment;
    id: string;
    matches(selector: any): boolean;
    setAttribute(name: string, value: string): void;
    private _resetReadonlyAttributes();
    removeAttribute(name: string): void;
    toString(): string;
    protected onAttributesEvent({mutation}: MutationEvent<any>): void;
    $setOwnerDocument(document: SyntheticDocument): void;
    $attach(document: SyntheticDocument): void;
    $detach(): void;
    protected attributeChangedCallback(name: string, oldValue: any, newValue: any): void;
    protected cloneShallow(): SyntheticDOMElement;
}
