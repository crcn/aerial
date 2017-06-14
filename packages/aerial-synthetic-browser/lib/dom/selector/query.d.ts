import { SyntheticDOMNode, SyntheticDOMElement, SyntheticDOMContainer } from "../markup";
import { Observable, IDisposable, IObservable, ITreeWalker, PropertyWatcher } from "aerial-common";
export interface IDOMTreeWalker extends ITreeWalker {
    stop(): any;
}
export declare function createSyntheticDOMWalker(each: (node: SyntheticDOMNode, walker?: IDOMTreeWalker) => void | boolean, deep?: boolean): IDOMTreeWalker;
export declare function querySelector(node: SyntheticDOMNode, selectorSource: string): SyntheticDOMElement;
export declare function querySelectorAll(node: SyntheticDOMNode, selectorSource: string): SyntheticDOMElement[];
export declare function selectorMatchesElement(selector: string, element: SyntheticDOMElement): boolean;
/**
 * Watches all elements that match a given element selector
 *
 * @export
 * @interface IElementQuerier
 */
export interface IElementQuerier<T extends SyntheticDOMElement> extends IObservable, IDisposable {
    /**
     * additional filter not available with selectors
     */
    filter: elementQueryFilterType;
    /**
     * CSS selector
     *
     * @type {string}
     */
    selector: string;
    /**
     * target to call querySelectorAll against
     *
     * @type {SyntheticDOMContainer}
     */
    target: SyntheticDOMContainer;
    /**
     */
    queriedElements: T[];
}
/**
 *
 * @export
 * @class ElementQuerierObserver
 */
export declare type elementQueryFilterType = (element: SyntheticDOMElement) => boolean;
/**
 * Speedier version of querySelector with a few additional features
 *
 * @export
 * @abstract
 * @class BaseElementQuerier
 * @extends {Observable}
 * @implements {IElementQuerier<T>}
 * @template T
 */
export declare abstract class BaseElementQuerier<T extends SyntheticDOMElement> extends Observable implements IElementQuerier<T> {
    target: SyntheticDOMContainer;
    filter: (element: SyntheticDOMElement) => boolean;
    selector: string;
    readonly targetWatcher: PropertyWatcher<BaseElementQuerier<any>, SyntheticDOMContainer>;
    readonly filterWatcher: PropertyWatcher<BaseElementQuerier<any>, (element: SyntheticDOMElement) => boolean>;
    readonly selectorWatcher: PropertyWatcher<BaseElementQuerier<any>, string>;
    readonly queriedElementsWatcher: PropertyWatcher<BaseElementQuerier<any>, T[]>;
    private _queriedElements;
    private _disposed;
    constructor(target?: SyntheticDOMContainer, selector?: string, filter?: elementQueryFilterType);
    readonly queriedElements: T[];
    protected debounceReset: any;
    protected setQueriedElements(newQueriedElements: T[]): void;
    dispose(): void;
    protected abstract reset(): any;
}
export declare class SyntheticElementQuerier<T extends SyntheticDOMElement> extends BaseElementQuerier<T> {
    private _rootObserver;
    constructor(target?: SyntheticDOMContainer, selector?: string, filter?: elementQueryFilterType);
    protected reset(): void;
    createChildQuerier<U extends SyntheticDOMElement & T>(selector?: string, filter?: elementQueryFilterType): ChildElementQuerier<U>;
    private onRootEvent(message);
    dispose(): void;
    private cleanup();
}
export declare class ChildElementQuerier<T extends SyntheticDOMElement> extends BaseElementQuerier<T> {
    parent: IElementQuerier<any>;
    readonly parentWatcher: PropertyWatcher<ChildElementQuerier<any>, IElementQuerier<any>>;
    private _parentWatchers;
    constructor(parent?: IElementQuerier<any>, selector?: string, filter?: elementQueryFilterType);
    protected reset(): void;
    dispose(): void;
}
