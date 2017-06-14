import { BaseContentEdit } from "aerial-sandbox";
import { SyntheticDocument } from "../document";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDOMElement } from "./element";
import { SyntheticDOMContainer } from "./container";
import { IEditor, IEditable, SandboxModule, SyntheticObjectEdit, ISyntheticObject, ISyntheticSourceInfo, SyntheticObjectEditor, SyntheticObjectSerializer } from "aerial-sandbox";
import { ISyntheticBrowser } from "../../browser";
import { DOMEventDispatcherMap } from "../events";
import { TreeNode, Metadata, CoreEvent, IComparable } from "aerial-common";
export interface ISerializedSyntheticDOMNode {
    source: ISyntheticSourceInfo;
    uid: any;
}
export declare const SyntheticDOMNodeSerializer: typeof SyntheticObjectSerializer;
export declare abstract class SyntheticDOMNodeEdit<T extends SyntheticDOMNode> extends SyntheticObjectEdit<T> {
}
export declare class SyntheticDOMNodeEditor<T extends SyntheticDOMNode> extends SyntheticObjectEditor<T> {
}
export declare abstract class SyntheticDOMNode extends TreeNode<SyntheticDOMNode> implements IComparable, ISyntheticObject, IEditable {
    readonly nodeName: string;
    readonly metadata: Metadata;
    abstract textContent: string;
    readonly namespaceURI: string;
    $uid: any;
    protected _attached: boolean;
    private _attachedBeforeCreatedCallback;
    /**
     * Bool check to ensure that createdCallback doesn't get called twice accidentally
     */
    private _createdCallbackCalled;
    /**
     * TRUE if the node has been loaded
     */
    private _ownerDocument;
    /**
     * @type {Node}
     */
    protected _native: Node;
    /**
     */
    $source: ISyntheticSourceInfo;
    /**
     * The DOM node type
     */
    readonly abstract nodeType: number;
    /**
     * Only set if the synthetic DOM node is running in a sandbox -- not always
     * the case especially with serialization.
     */
    $module: SandboxModule;
    private _eventDispatcher;
    constructor(nodeName: string);
    protected readonly eventDispatcher: DOMEventDispatcherMap;
    regenerateUID(): this;
    readonly uid: any;
    readonly ownerDocument: SyntheticDocument;
    readonly source: ISyntheticSourceInfo;
    readonly browser: ISyntheticBrowser;
    readonly module: SandboxModule;
    readonly childNodes: SyntheticDOMNode[];
    readonly parentElement: SyntheticDOMElement;
    readonly parentNode: SyntheticDOMContainer;
    addEventListener(type: string, listener: (event: CoreEvent) => any): void;
    removeEventListener(type: string, listener: (event: CoreEvent) => any): void;
    dispatchEvent(event: CoreEvent): void;
    contains(node: SyntheticDOMNode): boolean;
    /**
     * TODO - change this method name to something such as computeDifference
     *
     * @param {SyntheticDOMNode<any>} source
     * @returns
     */
    compare(source: SyntheticDOMNode): number;
    isEqualNode(node: SyntheticDOMNode): boolean;
    protected getInitialMetadata(): {};
    isSameNode(node: SyntheticDOMNode): boolean;
    /**
     * Attaches a native DOM node. TODO - possibly
     * change this to addProduct since the renderer can attach anything
     * that it wants -- even non-native elements that share an identical
     * API.
     *
     * @param {Node} node
     */
    attachNative(node: Node): void;
    readonly mountedToNative: Node;
    hasChildNodes(): boolean;
    onChildAdded(child: SyntheticDOMNode, index: number): void;
    onChildRemoved(child: SyntheticDOMNode, index: number): void;
    $setOwnerDocument(document: SyntheticDocument): void;
    $createdCallback(): void;
    protected createdCallback(): void;
    $attach(document: SyntheticDocument): void;
    protected $attachedCallback(): void;
    $detach(): void;
    $linkClone(clone: SyntheticDOMNode): SyntheticDOMNode;
    protected attachedCallback(): void;
    protected detachedCallback(): void;
    /**
     * Clone alias for standard DOM API. Note that there's a slight difference
     * with how these work -- cloneNode for the DOM calls createdCallback on elements. Whereas
     * cloneNode in this context doesn't. Instead cloneNode here serializes & deserializes the node -- reloading
     * the exact state of the object
     *
     * @param {boolean} [deep]
     * @returns
     */
    cloneNode(deep?: boolean): any;
    abstract accept(visitor: IMarkupNodeVisitor): any;
    clone(deep?: boolean): any;
    protected abstract cloneShallow(): any;
    abstract createEdit(): BaseContentEdit<any>;
    createEditor(): IEditor;
}
