import { IDispatcher } from "@tandem/mesh";
import { throttle, Cancelable } from "lodash";
import { getSelectorTester, ISelectorTester } from "./tester";
import { SyntheticDOMNode, SyntheticDOMElement, SyntheticDOMContainer, DOMNodeType } from "../markup";
import {
  CoreEvent,
  bindable,
  IWalkable,
  diffArray,
  Observable,
  filterTree,
  IDisposable,
  IObservable,
  ITreeWalker,
  traverseTree,
  bindProperty,
  findTreeNode,
  PropertyWatcher,
  DisposableCollection,
  PropertyMutation,
  propertyChangeCallbackType,
} from "@tandem/common";


import { CallbackDispatcher } from "@tandem/mesh";

export interface IDOMTreeWalker extends ITreeWalker {
  stop();
}

function isDocumentOrShadow(node: SyntheticDOMNode) {
  return node.nodeType === DOMNodeType.DOCUMENT || node.nodeType === DOMNodeType.DOCUMENT_FRAGMENT;
}

export function createSyntheticDOMWalker(each: (node: SyntheticDOMNode, walker?: IDOMTreeWalker) => void|boolean, deep: boolean = true): IDOMTreeWalker {
  const walker = {
    stop() {
      this._stopped = true;
    },
    accept(node: IWalkable & SyntheticDOMNode) {
      if (!this._stopped && (node.nodeType === DOMNodeType.ELEMENT || (deep && isDocumentOrShadow(node)))) {
        if (each(node, this) !== false && !this._stopped) {
          node.visitWalker(this);
        }
      }
    }
  };

  return walker;
}

export function querySelector(node: SyntheticDOMNode, selectorSource: string): SyntheticDOMElement {
  let found: SyntheticDOMElement;
  const tester = getSelectorTester(selectorSource, node);

  // no deep -- nwmatcher busts otherwise
  const walker = createSyntheticDOMWalker(node => {
    // no shadows
    if (node.nodeType === DOMNodeType.DOCUMENT_FRAGMENT) return false;
    if (tester.test(node)) {
      found = <SyntheticDOMElement>node;
      walker.stop();
    }
  });
  walker.accept(node);
  return found;
}

export function querySelectorAll(node: SyntheticDOMNode, selectorSource: string): SyntheticDOMElement[] {
  let found: SyntheticDOMElement[] = [];
  const tester = getSelectorTester(selectorSource, node);
  const walker = createSyntheticDOMWalker(node => {

    // no shadows
    if (node.nodeType === DOMNodeType.DOCUMENT_FRAGMENT) return false;
    if (tester.test(node)) {
      found.push(<SyntheticDOMElement>node);
    }
  });
  walker.accept(node);
  return found;
}

export function selectorMatchesElement(selector: string, element: SyntheticDOMElement): boolean {
  const tester = getSelectorTester(selector, element);
  return tester.test(element);
}

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

export type elementQueryFilterType = (element: SyntheticDOMElement) => boolean;
const ELEMENT_QUERY_TIMEOUT = 10;

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

export abstract class BaseElementQuerier<T extends SyntheticDOMElement> extends Observable implements IElementQuerier<T> {

  @bindable() public target: SyntheticDOMContainer;
  @bindable() public filter: (element: SyntheticDOMElement) => boolean;
  @bindable() public selector: string;

  // listener of bindable properties
  readonly targetWatcher: PropertyWatcher<BaseElementQuerier<any>, SyntheticDOMContainer>;
  readonly filterWatcher: PropertyWatcher<BaseElementQuerier<any>, (element: SyntheticDOMElement) => boolean>;
  readonly selectorWatcher: PropertyWatcher<BaseElementQuerier<any>, string>;
  readonly queriedElementsWatcher: PropertyWatcher<BaseElementQuerier<any>, T[]>;

  private _queriedElements: T[];
  private _disposed: boolean;

  constructor(target?: SyntheticDOMContainer, selector?: string, filter?: elementQueryFilterType) {
    super();

    this.target   = target;
    this.selector = selector;
    this.filter   = filter;
    this._queriedElements = [];

    this.targetWatcher          = new PropertyWatcher<BaseElementQuerier<any>, SyntheticDOMContainer>(this, "target");
    this.filterWatcher          = new PropertyWatcher<BaseElementQuerier<any>, (element: SyntheticDOMElement) => boolean>(this, "target");
    this.selectorWatcher        = new PropertyWatcher<BaseElementQuerier<any>, string>(this, "target");
    this.queriedElementsWatcher = new PropertyWatcher<BaseElementQuerier<any>, T[]>(this, "queriedElements");

    // all of this stuff may be set at the same time, so add a debounce. Besides, ElementQuerier
    // is intended to be asyncronous
    this.targetWatcher.connect(this.debounceReset);
    this.filterWatcher.connect(this.debounceReset);
    this.selectorWatcher.connect(this.debounceReset);

    this.reset();
  }

  get queriedElements(): T[] {
    return this._queriedElements;
  }

  protected debounceReset = throttle(() => {
    if (this._disposed) return;
    this.reset();
  }, ELEMENT_QUERY_TIMEOUT)

  protected setQueriedElements(newQueriedElements: T[]) {
    const oldQueriedElements = this._queriedElements;
    this.notify(new PropertyMutation(PropertyMutation.PROPERTY_CHANGE, this, "queriedElements", this._queriedElements = newQueriedElements, oldQueriedElements).toEvent());
  }

  dispose() {
    this._disposed = true;
    // this.watcher.dispose(); TODO
  }
  protected abstract reset();
}


export class SyntheticElementQuerier<T extends SyntheticDOMElement> extends BaseElementQuerier<T> {

  private _rootObserver: IDispatcher<any, any>;

  constructor(target?: SyntheticDOMContainer, selector: string = "*", filter?: elementQueryFilterType) {
    super(target, selector, filter);
    this._rootObserver = new CallbackDispatcher(this.onRootEvent.bind(this));
  }

  protected reset() {
    this.cleanup();
    if (!this.target) return this.setQueriedElements([]);
    this.target.observe(this._rootObserver);

    const found = [];
    const filter = this.filter || (() => true);
    const tester = getSelectorTester(this.selector, this.target);
    createSyntheticDOMWalker(node => {
      if (tester.test(node) && filter(<SyntheticDOMElement>node)) found.push(node);
    }).accept(this.target);


    this.setQueriedElements(found);
  }

  createChildQuerier<U extends SyntheticDOMElement & T>(selector: string = "*", filter?: elementQueryFilterType) {
    return new ChildElementQuerier<U>(this, selector, filter);
  }

  private onRootEvent(message: CoreEvent) {

    // reset on ALL messages -- there are cases where Nodes may contain state that
    // parts of the app using this querier needs to access (metadata for example). Debounce so
    // the app doesn't get clobbered with expensive querySelectorAll requests.
    this.debounceReset();
  }

  dispose() {
    super.dispose();
    this.cleanup();
  }

  private cleanup() {
    if (this.target) {
      this.target.unobserve(this._rootObserver);
    }
  }
}

export class ChildElementQuerier<T extends SyntheticDOMElement> extends BaseElementQuerier<T>{

  @bindable() public parent: IElementQuerier<any>;

  readonly parentWatcher: PropertyWatcher<ChildElementQuerier<any>, IElementQuerier<any>>;

  private _parentWatchers: DisposableCollection;

  constructor(parent?: IElementQuerier<any>, selector: string = "*", filter?: elementQueryFilterType) {
    super(parent && parent.target, selector, filter);

    this.parentWatcher = new PropertyWatcher<ChildElementQuerier<any>, IElementQuerier<any>>(this, "parent");

    

    this.parentWatcher.connect((parent: SyntheticElementQuerier<any>) => {
      if (this._parentWatchers) this._parentWatchers.dispose();
      const { targetWatcher, queriedElementsWatcher } = parent;
      parent.targetWatcher
      this._parentWatchers = DisposableCollection.create(
        targetWatcher.connect(target => this.target = target).trigger(),
        queriedElementsWatcher.connect(this.reset.bind(this))
      ) as DisposableCollection;
    });
  }

  protected reset() {
    if (!this.parent) return this.setQueriedElements([]);

    const filter = this.filter || (() => true);
    const tester = getSelectorTester(this.selector, this.parent.target);

    this.setQueriedElements(this.parent.queriedElements.filter(element => tester.test(element) && filter(element)));
  }

  dispose() {
    super.dispose();
    if (this._parentWatchers) this._parentWatchers.dispose();
  }
}