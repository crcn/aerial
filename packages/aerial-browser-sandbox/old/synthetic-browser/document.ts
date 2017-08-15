
import { SyntheticWindow, SyntheticDOMImplementation } from "./window";
import { SyntheticElement } from "./html";
import { SyntheticCSSStyleSheet } from "./css";
import { CallbackBus } from "mesh7";

import { SyntheticHTMLCollection } from "./collections";

import {
  DOMNodeType,
  SyntheticDOMText,
  SyntheticDOMNode,
  IMarkupNodeVisitor,
  SyntheticDOMElement,
  SyntheticDOMComment,
  DOMContainerEditor,
  SyntheticDOMContainer,
  SyntheticDOMValueNode,
  isDOMContainerMutation,
  SyntheticDOMContainerEdit,
  syntheticElementClassType,
  SyntheticDocumentFragment,
  SyntheticDOMNodeSerializer,
  SyntheticDOMContainerEditor,
} from "./markup";

import {
  bindable,
  Kernel,
  Mutation,
  diffArray,
  serialize,
  findTreeNode,
  filterTree,
  ArrayMutation,
  ISerializer,
  deserialize,
  ITreeWalker,
  serializable,
  MutationEvent,
  RemoveMutation,
  BubbleDispatcher,
  MoveChildMutation,
  SerializedContentType,
  InsertChildMutation,
  RemoveChildMutation,
  ObservableCollection,
} from "aerial-common";


export interface IRegisterComponentOptions {
  prototype: any;
  extends: string;
}

class SyntheticDocumentSerializer implements ISerializer<SyntheticDocument, any[]> {
  serialize(document: SyntheticDocument) {
    return [
      // need to cast style sheet to vanilla array before mapping
      document.defaultNamespaceURI,
      [].concat(document.styleSheets).map(serialize),
      document.childNodes.map(serialize),
    ];
  }
  deserialize([defaultNamespaceURI, styleSheets, childNodes], kernel) {
    const document = new SyntheticDocument(defaultNamespaceURI);
    document.styleSheets.push(...styleSheets.map(raw => deserialize(raw, kernel)));
    for (let i = 0, n = childNodes.length; i < n; i++) {
      document.appendChild(deserialize(childNodes[i], kernel));
    }
    return document;
  }
}

export namespace SyntheticDocumentMutationTypes {
  export const ADD_DOCUMENT_STYLE_SHEET_EDIT    = "addDocumentStyleSheetEdit";
  export const REMOVE_DOCUMENT_STYLE_SHEET_EDIT = "removeDocumentStyleSheetEdit";
  export const MOVE_DOCUMENT_STYLE_SHEET_EDIT   = "moveDocumentStyleSheetEdit";;
}

export class SyntheticDocumentEdit extends SyntheticDOMContainerEdit<SyntheticDocument> {

  addStyleSheet(stylesheet: SyntheticCSSStyleSheet, index?: number) {
    return this.addChange(new InsertChildMutation(SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet, index));
  }

  removeStyleSheet(stylesheet: SyntheticCSSStyleSheet) {
    return this.addChange(new RemoveChildMutation(SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet, this.target.styleSheets.indexOf(stylesheet)));
  }

  moveStyleSheet(stylesheet: SyntheticCSSStyleSheet, index: number) {
    return this.addChange(new MoveChildMutation(SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet, this.target.styleSheets.indexOf(stylesheet), index));
  }

  protected addDiff(newDocument: SyntheticDocument) {

    diffArray(this.target.styleSheets, newDocument.styleSheets, (oldStyleSheet, newStyleSheet) => {

      if (oldStyleSheet.source && newStyleSheet.source) {
        return oldStyleSheet.source.uri === newStyleSheet.source.uri ? 0 : -1;
      }
      
      // simple distance function
      return Math.abs(oldStyleSheet.cssText.length - newStyleSheet.cssText.length);
    }).accept({
      visitInsert: ({ index, value }) => {
        this.addStyleSheet(value, index);
      },
      visitRemove: ({ index }) => {
        this.removeStyleSheet(this.target.styleSheets[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, index }) => {
        if (patchedOldIndex !== index) {
          this.moveStyleSheet(this.target.styleSheets[originalOldIndex], index);
        }
        this.addChildEdit(this.target.styleSheets[originalOldIndex].createEdit().fromDiff(newValue));
      }
    });

    return super.addDiff(newDocument);
  }
}

export class SyntheticDocumentEditor<T extends SyntheticDocument> extends SyntheticDOMContainerEditor<T> {
  applySingleMutation(mutation: Mutation<T>) {
    super.applySingleMutation(mutation);
    const target = this.target;
    if (mutation.type === SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT) {
      target.styleSheets.splice((<RemoveChildMutation<any, any>>mutation).index, 1);
    } else if (mutation.type === SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT) {
      target.styleSheets.splice((<InsertChildMutation<any, SyntheticCSSStyleSheet>>mutation).index, 0, (<InsertChildMutation<any, SyntheticCSSStyleSheet>>mutation).child.clone(true));
    } else if (mutation.type === SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT) {
      const oldIndex = (<MoveChildMutation<any, any>>mutation).oldIndex;
      target.styleSheets.splice(oldIndex, 1);
      target.styleSheets.splice((<MoveChildMutation<any, SyntheticCSSStyleSheet>>mutation).index, 0);
    }
  }
}

export function isDOMDocumentMutation(mutation: Mutation<any>) {
  return !!{
    [SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT]: true,
    [SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT]: true,
    [SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT]: true
  }[mutation.type];
}

const filterDOMElement = (element: SyntheticDOMNode) => element.nodeType === DOMNodeType.ELEMENT;

export class SyntheticDocument extends SyntheticDOMContainer {
  readonly nodeType: number = DOMNodeType.DOCUMENT;
  readonly styleSheets: ObservableCollection<SyntheticCSSStyleSheet>;
  private _readyState: string;
  public $registeredElements: any;
  public $window: SyntheticWindow;
  public $ownerNode: SyntheticDOMNode;
  public $implementation: SyntheticDOMImplementation;
  public cookie: string = "";


  // namespaceURI here is non-standard, but that's
  constructor(readonly defaultNamespaceURI: string, implementation?: SyntheticDOMImplementation) {
    super("#document");
    this.$implementation = implementation;
    // this.styleSheets = ObservableCollection.create() as any;
    // this.styleSheets.observe(new CallbackBus(this.onStyleSheetsEvent.bind(this)));
    this.$registeredElements = {};
  }

  get implementation() {
    return this.$implementation;
  }

  get scripts() {
    return this.getElementsByTagName("script");
  }

  get browser(): any {
    return null;
  }

  get ownerNode(): SyntheticDOMNode {
    return this.$ownerNode;
  }

  get defaultView(): SyntheticWindow {
    return this.$window;
  }

  get documentElement(): SyntheticElement {
    return this.childNodes.find(filterDOMElement) as SyntheticElement;
  }

  get head(): SyntheticElement {
    return this.documentElement.childNodes.find(filterDOMElement) as SyntheticElement;
  }

  get body(): SyntheticElement {
    return this.documentElement.childNodes.filter(filterDOMElement)[1] as SyntheticElement;
  }

  get location(): Location {
    return null;
  }

  get URL() {
    return this.location.toString();
  }

  get readyState() {
    return this._readyState;
  }

  set location(value: Location) {

  }

  open() {

  }

  close() {
    
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitDocument(this);
  }

  getElementById(id: string) {
    return this.querySelector("#" + id);
  }

  createElementNS(ns: string, tagName: string): SyntheticDOMElement {
    const nsElements = this.$registeredElements[ns] || {};
    const elementClass = this.$getElementClassNS(ns, tagName);
    const element = this.own(new elementClass(ns, tagName));
    element.$createdCallback();
    return element;
  }

  $getElementClassNS(ns: string, tagName: string): syntheticElementClassType {
    const nsElements = this.$registeredElements[ns] || {};
    const elementClass = nsElements[tagName.toLowerCase()] || nsElements.default || SyntheticDOMElement;
    return elementClass;
  }

  createEdit(): SyntheticDocumentEdit {
    return new SyntheticDocumentEdit(this);
  }
  /*

  From http://www.w3schools.com/tags/

  execute the following script in console debugger if any elements change:

  console.log(Array.prototype.filter.call(document.querySelectorAll('a'), (element) => {
    return /^tag_/.test(element.getAttribute('href'));
  })
  .map((element) => {
    return element.innerText.replace(/>|</g, '');
  })
  .filter((tagName) => { return /^\w+$/.test(tagName); })
  .map((tagName) => {
    return `createElement(tagName: "${tagName}"): SyntheticElement;`;
  }).join("\n"));
  */

  createElement(tagName: "a"): SyntheticElement;
  createElement(tagName: "abbr"): SyntheticElement;
  createElement(tagName: "acronym"): SyntheticElement;
  createElement(tagName: "address"): SyntheticElement;
  createElement(tagName: "applet"): SyntheticElement;
  createElement(tagName: "area"): SyntheticElement;
  createElement(tagName: "article"): SyntheticElement;
  createElement(tagName: "aside"): SyntheticElement;
  createElement(tagName: "audio"): SyntheticElement;
  createElement(tagName: "b"): SyntheticElement;
  createElement(tagName: "base"): SyntheticElement;
  createElement(tagName: "basefont"): SyntheticElement;
  createElement(tagName: "bdi"): SyntheticElement;
  createElement(tagName: "bdo"): SyntheticElement;
  createElement(tagName: "big"): SyntheticElement;
  createElement(tagName: "blockquote"): SyntheticElement;
  createElement(tagName: "body"): SyntheticElement;
  createElement(tagName: "br"): SyntheticElement;
  createElement(tagName: "button"): SyntheticElement;
  createElement(tagName: "canvas"): SyntheticElement;
  createElement(tagName: "caption"): SyntheticElement;
  createElement(tagName: "center"): SyntheticElement;
  createElement(tagName: "cite"): SyntheticElement;
  createElement(tagName: "code"): SyntheticElement;
  createElement(tagName: "col"): SyntheticElement;
  createElement(tagName: "colgroup"): SyntheticElement;
  createElement(tagName: "datalist"): SyntheticElement;
  createElement(tagName: "dd"): SyntheticElement;
  createElement(tagName: "del"): SyntheticElement;
  createElement(tagName: "details"): SyntheticElement;
  createElement(tagName: "dfn"): SyntheticElement;
  createElement(tagName: "dialog"): SyntheticElement;
  createElement(tagName: "dir"): SyntheticElement;
  createElement(tagName: "dl"): SyntheticElement;
  createElement(tagName: "dt"): SyntheticElement;
  createElement(tagName: "em"): SyntheticElement;
  createElement(tagName: "embed"): SyntheticElement;
  createElement(tagName: "fieldset"): SyntheticElement;
  createElement(tagName: "figcaption"): SyntheticElement;
  createElement(tagName: "figure"): SyntheticElement;
  createElement(tagName: "font"): SyntheticElement;
  createElement(tagName: "footer"): SyntheticElement;
  createElement(tagName: "form"): SyntheticElement;
  createElement(tagName: "frame"): SyntheticElement;
  createElement(tagName: "frameset"): SyntheticElement;
  createElement(tagName: "head"): SyntheticElement;
  createElement(tagName: "header"): SyntheticElement;
  createElement(tagName: "hr"): SyntheticElement;
  createElement(tagName: "html"): SyntheticElement;
  createElement(tagName: "i"): SyntheticElement;
  createElement(tagName: "iframe"): SyntheticElement;
  createElement(tagName: "img"): SyntheticElement;
  createElement(tagName: "input"): SyntheticElement;
  createElement(tagName: "ins"): SyntheticElement;
  createElement(tagName: "kbd"): SyntheticElement;
  createElement(tagName: "keygen"): SyntheticElement;
  createElement(tagName: "label"): SyntheticElement;
  createElement(tagName: "legend"): SyntheticElement;
  createElement(tagName: "li"): SyntheticElement;
  createElement(tagName: "link"): SyntheticElement;
  createElement(tagName: "main"): SyntheticElement;
  createElement(tagName: "map"): SyntheticElement;
  createElement(tagName: "mark"): SyntheticElement;
  createElement(tagName: "menu"): SyntheticElement;
  createElement(tagName: "WebMenuItem"): SyntheticElement;
  createElement(tagName: "meta"): SyntheticElement;
  createElement(tagName: "meter"): SyntheticElement;
  createElement(tagName: "nav"): SyntheticElement;
  createElement(tagName: "noframes"): SyntheticElement;
  createElement(tagName: "noscript"): SyntheticElement;
  createElement(tagName: "object"): SyntheticElement;
  createElement(tagName: "ol"): SyntheticElement;
  createElement(tagName: "optgroup"): SyntheticElement;
  createElement(tagName: "option"): SyntheticElement;
  createElement(tagName: "output"): SyntheticElement;
  createElement(tagName: "p"): SyntheticElement;
  createElement(tagName: "param"): SyntheticElement;
  createElement(tagName: "pre"): SyntheticElement;
  createElement(tagName: "progress"): SyntheticElement;
  createElement(tagName: "q"): SyntheticElement;
  createElement(tagName: "rp"): SyntheticElement;
  createElement(tagName: "rt"): SyntheticElement;
  createElement(tagName: "ruby"): SyntheticElement;
  createElement(tagName: "s"): SyntheticElement;
  createElement(tagName: "samp"): SyntheticElement;
  createElement(tagName: "script"): SyntheticElement;
  createElement(tagName: "section"): SyntheticElement;
  createElement(tagName: "select"): SyntheticElement;
  createElement(tagName: "small"): SyntheticElement;
  createElement(tagName: "source"): SyntheticElement;
  createElement(tagName: "span"): SyntheticElement;
  createElement(tagName: "strike"): SyntheticElement;
  createElement(tagName: "strong"): SyntheticElement;
  createElement(tagName: "style"): SyntheticElement;
  createElement(tagName: "sub"): SyntheticElement;
  createElement(tagName: "summary"): SyntheticElement;
  createElement(tagName: "sup"): SyntheticElement;
  createElement(tagName: "table"): SyntheticElement;
  createElement(tagName: "tbody"): SyntheticElement;
  createElement(tagName: "td"): SyntheticElement;
  createElement(tagName: "textarea"): SyntheticElement;
  createElement(tagName: "tfoot"): SyntheticElement;
  createElement(tagName: "th"): SyntheticElement;
  createElement(tagName: "thead"): SyntheticElement;
  createElement(tagName: "time"): SyntheticElement;
  createElement(tagName: "title"): SyntheticElement;
  createElement(tagName: "tr"): SyntheticElement;
  createElement(tagName: "track"): SyntheticElement;
  createElement(tagName: "tt"): SyntheticElement;
  createElement(tagName: "u"): SyntheticElement;
  createElement(tagName: "ul"): SyntheticElement;
  createElement(tagName: "var"): SyntheticElement;
  createElement(tagName: "video"): SyntheticElement;
  createElement(tagName: "wbr"): SyntheticElement;
  createElement(tagName: "a"): SyntheticElement;
  createElement(tagName: "abbr"): SyntheticElement;
  createElement(tagName: "acronym"): SyntheticElement;
  createElement(tagName: "address"): SyntheticElement;
  createElement(tagName: "applet"): SyntheticElement;
  createElement(tagName: "area"): SyntheticElement;
  createElement(tagName: "article"): SyntheticElement;
  createElement(tagName: "aside"): SyntheticElement;
  createElement(tagName: "audio"): SyntheticElement;
  createElement(tagName: "b"): SyntheticElement;
  createElement(tagName: "base"): SyntheticElement;
  createElement(tagName: "basefont"): SyntheticElement;
  createElement(tagName: "bdi"): SyntheticElement;
  createElement(tagName: "bdo"): SyntheticElement;
  createElement(tagName: "big"): SyntheticElement;
  createElement(tagName: "blockquote"): SyntheticElement;
  createElement(tagName: "body"): SyntheticElement;
  createElement(tagName: "br"): SyntheticElement;
  createElement(tagName: "button"): SyntheticElement;
  createElement(tagName: "canvas"): SyntheticElement;
  createElement(tagName: "caption"): SyntheticElement;
  createElement(tagName: "center"): SyntheticElement;
  createElement(tagName: "cite"): SyntheticElement;
  createElement(tagName: "code"): SyntheticElement;
  createElement(tagName: "col"): SyntheticElement;
  createElement(tagName: "colgroup"): SyntheticElement;
  createElement(tagName: "datalist"): SyntheticElement;
  createElement(tagName: "dd"): SyntheticElement;
  createElement(tagName: "del"): SyntheticElement;
  createElement(tagName: "details"): SyntheticElement;
  createElement(tagName: "dfn"): SyntheticElement;
  createElement(tagName: "dialog"): SyntheticElement;
  createElement(tagName: "dir"): SyntheticElement;
  createElement(tagName: "div"): SyntheticElement;
  createElement(tagName: "dl"): SyntheticElement;
  createElement(tagName: "dt"): SyntheticElement;
  createElement(tagName: "em"): SyntheticElement;
  createElement(tagName: "embed"): SyntheticElement;
  createElement(tagName: "fieldset"): SyntheticElement;
  createElement(tagName: "figcaption"): SyntheticElement;
  createElement(tagName: "figure"): SyntheticElement;
  createElement(tagName: "font"): SyntheticElement;
  createElement(tagName: "footer"): SyntheticElement;
  createElement(tagName: "form"): SyntheticElement;
  createElement(tagName: "frame"): SyntheticElement;
  createElement(tagName: "frameset"): SyntheticElement;
  createElement(tagName: "head"): SyntheticElement;
  createElement(tagName: "header"): SyntheticElement;
  createElement(tagName: "hr"): SyntheticElement;
  createElement(tagName: "html"): SyntheticElement;
  createElement(tagName: "i"): SyntheticElement;
  createElement(tagName: "iframe"): SyntheticElement;
  createElement(tagName: "img"): SyntheticElement;
  createElement(tagName: "input"): SyntheticElement;
  createElement(tagName: "ins"): SyntheticElement;
  createElement(tagName: "kbd"): SyntheticElement;
  createElement(tagName: "keygen"): SyntheticElement;
  createElement(tagName: "label"): SyntheticElement;
  createElement(tagName: "legend"): SyntheticElement;
  createElement(tagName: "li"): SyntheticElement;
  createElement(tagName: "link"): SyntheticElement;
  createElement(tagName: "main"): SyntheticElement;
  createElement(tagName: "map"): SyntheticElement;
  createElement(tagName: "mark"): SyntheticElement;
  createElement(tagName: "menu"): SyntheticElement;
  createElement(tagName: "WebMenuItem"): SyntheticElement;
  createElement(tagName: "meta"): SyntheticElement;
  createElement(tagName: "meter"): SyntheticElement;
  createElement(tagName: "nav"): SyntheticElement;
  createElement(tagName: "noframes"): SyntheticElement;
  createElement(tagName: "noscript"): SyntheticElement;
  createElement(tagName: "object"): SyntheticElement;
  createElement(tagName: "ol"): SyntheticElement;
  createElement(tagName: "optgroup"): SyntheticElement;
  createElement(tagName: "option"): SyntheticElement;
  createElement(tagName: "output"): SyntheticElement;
  createElement(tagName: "p"): SyntheticElement;
  createElement(tagName: "param"): SyntheticElement;
  createElement(tagName: "pre"): SyntheticElement;
  createElement(tagName: "progress"): SyntheticElement;
  createElement(tagName: "q"): SyntheticElement;
  createElement(tagName: "rp"): SyntheticElement;
  createElement(tagName: "rt"): SyntheticElement;
  createElement(tagName: "ruby"): SyntheticElement;
  createElement(tagName: "s"): SyntheticElement;
  createElement(tagName: "samp"): SyntheticElement;
  createElement(tagName: "script"): SyntheticElement;
  createElement(tagName: "section"): SyntheticElement;
  createElement(tagName: "select"): SyntheticElement;
  createElement(tagName: "small"): SyntheticElement;
  createElement(tagName: "source"): SyntheticElement;
  createElement(tagName: "span"): SyntheticElement;
  createElement(tagName: "strike"): SyntheticElement;
  createElement(tagName: "strong"): SyntheticElement;
  createElement(tagName: "style"): SyntheticElement;
  createElement(tagName: "sub"): SyntheticElement;
  createElement(tagName: "summary"): SyntheticElement;
  createElement(tagName: "sup"): SyntheticElement;
  createElement(tagName: "table"): SyntheticElement;
  createElement(tagName: "tbody"): SyntheticElement;
  createElement(tagName: "td"): SyntheticElement;
  createElement(tagName: "textarea"): SyntheticElement;
  createElement(tagName: "tfoot"): SyntheticElement;
  createElement(tagName: "th"): SyntheticElement;
  createElement(tagName: "thead"): SyntheticElement;
  createElement(tagName: "time"): SyntheticElement;
  createElement(tagName: "title"): SyntheticElement;
  createElement(tagName: "tr"): SyntheticElement;
  createElement(tagName: "track"): SyntheticElement;
  createElement(tagName: "tt"): SyntheticElement;
  createElement(tagName: "u"): SyntheticElement;
  createElement(tagName: "ul"): SyntheticElement;
  createElement(tagName: "var"): SyntheticElement;
  createElement(tagName: "video"): SyntheticElement;
  createElement(tagName: "wbr"): SyntheticElement;
  createElement(unknownTagName: any): SyntheticElement;

  createElement(tagName: string) {
    return this.own(this.createElementNS(this.defaultNamespaceURI, tagName));
  }

  registerElement(tagName: string, elementClass: syntheticElementClassType);
  registerElement(tagName: string, options: IRegisterComponentOptions);

  registerElement(tagName: string, options: any): syntheticElementClassType {
    return this.registerElementNS(this.defaultNamespaceURI, tagName, options);
  }

  // non-standard APIs to enable custom elements according to the doc type -- necessary for
  // cases where we're mixing different template engines such as angular, vuejs, etc.
  registerElementNS(ns: string, tagName: string, elementClass: syntheticElementClassType);
  registerElementNS(ns: string, tagName: string, options: IRegisterComponentOptions);

  registerElementNS(ns: string, tagName: string, ctor: any): syntheticElementClassType {
    if (!this.$registeredElements[ns]) {
      this.$registeredElements[ns] = {};
    }
    
    return this.$registeredElements[ns][tagName.toLowerCase()] = ctor;
  }

  createComment(nodeValue: string) {
    return this.own(new SyntheticDOMComment(nodeValue));
  }

  createTextNode(nodeValue: string) {
    return this.own(new SyntheticDOMText(nodeValue));
  }

  createDocumentFragment() {
    return this.own(new SyntheticDocumentFragment());
  }

  visitWalker(walker: ITreeWalker) {
    this.styleSheets.forEach(styleSheet => walker.accept(styleSheet));
    super.visitWalker(walker);
  }
  

  $load(content: string) {
    this._setReadyState("loading");
    // const expression = parseHTMLDocument(content);
    // const childNodes = expression.childNodes.map(childExpression => mapExpressionToNode(childExpression, this));

    // for (const child of childNodes) {
    //   if (!child) continue;
    //   this.appendChild(child);
    //   constructNodeTree(child);
    // }

    // this._setReadyState("interactive");
    // this._setReadyState("complete");

    // const domContentLoadedEvent = new SEnvEvent();
    // domContentLoadedEvent.initEvent("DOMContentLoaded", true, true);
    // this.dispatchEvent(domContentLoadedEvent);

    // // wait for images, stylesheets, and other external resources
    // await whenLoaded(this);

    // const loadEvent = new SEnvEvent();
    // loadEvent.initEvent("load", true, true);
    // this.dispatchEvent(loadEvent);
  }

  private _setReadyState(name: string) {
    this._readyState = name;
  }

  onChildAdded(child: SyntheticDOMNode, index: number) {
    super.onChildAdded(child, index);
    child.$attach(this);
  }

  protected cloneShallow() {
    return new SyntheticDocument(this.defaultNamespaceURI, this.implementation);
  }

  hasFocus() {
    return false;
  }

  public $linkClone(clone: SyntheticDocument) {
    clone.$window         = this.defaultView;
    clone.$implementation = clone.implementation;
    return super.$linkClone(clone);
  }

  private own<T extends SyntheticDOMNode>(node: T) {
    node.$setOwnerDocument(this);
    return node;
  }

  createEditor() {
    return new SyntheticDocumentEditor(this);
  }

  write(content: string) {
    console.error(`document.write is not currently supported`);
  }

  private onStyleSheetsEvent({ mutation }: MutationEvent<any>) {
    if (!mutation) return;

    if (mutation.type === ArrayMutation.ARRAY_DIFF) {
      (<ArrayMutation<SyntheticCSSStyleSheet>>mutation).accept({
        visitUpdate: ({ newValue, index, patchedOldIndex }) => {
          if (index !== patchedOldIndex) {
            this.notify(new MoveChildMutation(SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT, this, newValue, patchedOldIndex, index).toEvent());
          }
        },
        visitInsert: ({ value, index }) => {
          if (!value.$ownerNode) {
            value.$ownerNode = this;
          }
          this.notify(new InsertChildMutation(SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT, this, value, index).toEvent());
        },
        visitRemove: ({ value, index }) => {
          value.$ownerNode = undefined;
          this.notify(new RemoveChildMutation(SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT, this, value, index).toEvent());
        }
      })
    }
  }
}
