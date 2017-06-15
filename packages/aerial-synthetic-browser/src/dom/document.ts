import { CallbackBus } from "mesh";
import { SyntheticWindow, SyntheticDOMImplementation } from "./window";
import { ISyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticHTMLElement } from "./html";
import { SyntheticCSSStyleSheet } from "./css";
import { Sandbox } from "aerial-sandbox";

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

// TODO - this shouldn't be here
@serializable("SyntheticDocumentEdit", {
  serialize({ mutations }: SyntheticDocumentEdit) {
    return {
      mutations: mutations.map(serialize)
    };
  },
  deserialize({ mutations }, kernel, ctor: { new(): SyntheticDocumentEdit }) {
    const edit = new ctor();
    edit.mutations.push(...mutations.map(mutation => deserialize(mutation, kernel)));
    return edit;
  }
})
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

@serializable("SyntheticDocument", new SyntheticDOMNodeSerializer(new SyntheticDocumentSerializer()))
export class SyntheticDocument extends SyntheticDOMContainer {
  readonly nodeType: number = DOMNodeType.DOCUMENT;
  readonly styleSheets: ObservableCollection<SyntheticCSSStyleSheet>;
  public $registeredElements: any;
  public $window: SyntheticWindow;
  public $ownerNode: SyntheticDOMNode;
  public $implementation: SyntheticDOMImplementation;
  public cookie: string = "";


  // namespaceURI here is non-standard, but that's
  constructor(readonly defaultNamespaceURI: string, implementation?: SyntheticDOMImplementation) {
    super("#document");
    this.$implementation = implementation;
    this.styleSheets = new ObservableCollection<SyntheticCSSStyleSheet>();
    this.styleSheets.observe(new CallbackBus(this.onStyleSheetsEvent.bind(this)));
    this.$registeredElements = {};
  }

  get implementation() {
    return this.$implementation;
  }
  

  get sandbox() {
    return this.defaultView.sandbox;
  }

  get scripts() {
    return this.getElementsByTagName("script");
  }

  get browser(): ISyntheticBrowser {
    return this.$window.browser;
  }

  get ownerNode(): SyntheticDOMNode {
    return this.$ownerNode;
  }

  get defaultView(): SyntheticWindow {
    return this.$window;
  }

  get documentElement(): SyntheticHTMLElement {
    return this.childNodes.find(filterDOMElement) as SyntheticHTMLElement;
  }

  get head(): SyntheticHTMLElement {
    return this.documentElement.childNodes.find(filterDOMElement) as SyntheticHTMLElement;
  }

  get body(): SyntheticHTMLElement {
    return this.documentElement.childNodes.filter(filterDOMElement)[1] as SyntheticHTMLElement;
  }

  get location(): SyntheticLocation {
    return this.$window.location;
  }

  get URL() {
    return this.location.toString();
  }

  set location(value: SyntheticLocation) {
    this.$window.location = value;
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
    return `createElement(tagName: "${tagName}"): SyntheticHTMLElement;`;
  }).join("\n"));
  */

  createElement(tagName: "a"): SyntheticHTMLElement;
  createElement(tagName: "abbr"): SyntheticHTMLElement;
  createElement(tagName: "acronym"): SyntheticHTMLElement;
  createElement(tagName: "address"): SyntheticHTMLElement;
  createElement(tagName: "applet"): SyntheticHTMLElement;
  createElement(tagName: "area"): SyntheticHTMLElement;
  createElement(tagName: "article"): SyntheticHTMLElement;
  createElement(tagName: "aside"): SyntheticHTMLElement;
  createElement(tagName: "audio"): SyntheticHTMLElement;
  createElement(tagName: "b"): SyntheticHTMLElement;
  createElement(tagName: "base"): SyntheticHTMLElement;
  createElement(tagName: "basefont"): SyntheticHTMLElement;
  createElement(tagName: "bdi"): SyntheticHTMLElement;
  createElement(tagName: "bdo"): SyntheticHTMLElement;
  createElement(tagName: "big"): SyntheticHTMLElement;
  createElement(tagName: "blockquote"): SyntheticHTMLElement;
  createElement(tagName: "body"): SyntheticHTMLElement;
  createElement(tagName: "br"): SyntheticHTMLElement;
  createElement(tagName: "button"): SyntheticHTMLElement;
  createElement(tagName: "canvas"): SyntheticHTMLElement;
  createElement(tagName: "caption"): SyntheticHTMLElement;
  createElement(tagName: "center"): SyntheticHTMLElement;
  createElement(tagName: "cite"): SyntheticHTMLElement;
  createElement(tagName: "code"): SyntheticHTMLElement;
  createElement(tagName: "col"): SyntheticHTMLElement;
  createElement(tagName: "colgroup"): SyntheticHTMLElement;
  createElement(tagName: "datalist"): SyntheticHTMLElement;
  createElement(tagName: "dd"): SyntheticHTMLElement;
  createElement(tagName: "del"): SyntheticHTMLElement;
  createElement(tagName: "details"): SyntheticHTMLElement;
  createElement(tagName: "dfn"): SyntheticHTMLElement;
  createElement(tagName: "dialog"): SyntheticHTMLElement;
  createElement(tagName: "dir"): SyntheticHTMLElement;
  createElement(tagName: "dl"): SyntheticHTMLElement;
  createElement(tagName: "dt"): SyntheticHTMLElement;
  createElement(tagName: "em"): SyntheticHTMLElement;
  createElement(tagName: "embed"): SyntheticHTMLElement;
  createElement(tagName: "fieldset"): SyntheticHTMLElement;
  createElement(tagName: "figcaption"): SyntheticHTMLElement;
  createElement(tagName: "figure"): SyntheticHTMLElement;
  createElement(tagName: "font"): SyntheticHTMLElement;
  createElement(tagName: "footer"): SyntheticHTMLElement;
  createElement(tagName: "form"): SyntheticHTMLElement;
  createElement(tagName: "frame"): SyntheticHTMLElement;
  createElement(tagName: "frameset"): SyntheticHTMLElement;
  createElement(tagName: "head"): SyntheticHTMLElement;
  createElement(tagName: "header"): SyntheticHTMLElement;
  createElement(tagName: "hr"): SyntheticHTMLElement;
  createElement(tagName: "html"): SyntheticHTMLElement;
  createElement(tagName: "i"): SyntheticHTMLElement;
  createElement(tagName: "iframe"): SyntheticHTMLElement;
  createElement(tagName: "img"): SyntheticHTMLElement;
  createElement(tagName: "input"): SyntheticHTMLElement;
  createElement(tagName: "ins"): SyntheticHTMLElement;
  createElement(tagName: "kbd"): SyntheticHTMLElement;
  createElement(tagName: "keygen"): SyntheticHTMLElement;
  createElement(tagName: "label"): SyntheticHTMLElement;
  createElement(tagName: "legend"): SyntheticHTMLElement;
  createElement(tagName: "li"): SyntheticHTMLElement;
  createElement(tagName: "link"): SyntheticHTMLElement;
  createElement(tagName: "main"): SyntheticHTMLElement;
  createElement(tagName: "map"): SyntheticHTMLElement;
  createElement(tagName: "mark"): SyntheticHTMLElement;
  createElement(tagName: "menu"): SyntheticHTMLElement;
  createElement(tagName: "WebMenuItem"): SyntheticHTMLElement;
  createElement(tagName: "meta"): SyntheticHTMLElement;
  createElement(tagName: "meter"): SyntheticHTMLElement;
  createElement(tagName: "nav"): SyntheticHTMLElement;
  createElement(tagName: "noframes"): SyntheticHTMLElement;
  createElement(tagName: "noscript"): SyntheticHTMLElement;
  createElement(tagName: "object"): SyntheticHTMLElement;
  createElement(tagName: "ol"): SyntheticHTMLElement;
  createElement(tagName: "optgroup"): SyntheticHTMLElement;
  createElement(tagName: "option"): SyntheticHTMLElement;
  createElement(tagName: "output"): SyntheticHTMLElement;
  createElement(tagName: "p"): SyntheticHTMLElement;
  createElement(tagName: "param"): SyntheticHTMLElement;
  createElement(tagName: "pre"): SyntheticHTMLElement;
  createElement(tagName: "progress"): SyntheticHTMLElement;
  createElement(tagName: "q"): SyntheticHTMLElement;
  createElement(tagName: "rp"): SyntheticHTMLElement;
  createElement(tagName: "rt"): SyntheticHTMLElement;
  createElement(tagName: "ruby"): SyntheticHTMLElement;
  createElement(tagName: "s"): SyntheticHTMLElement;
  createElement(tagName: "samp"): SyntheticHTMLElement;
  createElement(tagName: "script"): SyntheticHTMLElement;
  createElement(tagName: "section"): SyntheticHTMLElement;
  createElement(tagName: "select"): SyntheticHTMLElement;
  createElement(tagName: "small"): SyntheticHTMLElement;
  createElement(tagName: "source"): SyntheticHTMLElement;
  createElement(tagName: "span"): SyntheticHTMLElement;
  createElement(tagName: "strike"): SyntheticHTMLElement;
  createElement(tagName: "strong"): SyntheticHTMLElement;
  createElement(tagName: "style"): SyntheticHTMLElement;
  createElement(tagName: "sub"): SyntheticHTMLElement;
  createElement(tagName: "summary"): SyntheticHTMLElement;
  createElement(tagName: "sup"): SyntheticHTMLElement;
  createElement(tagName: "table"): SyntheticHTMLElement;
  createElement(tagName: "tbody"): SyntheticHTMLElement;
  createElement(tagName: "td"): SyntheticHTMLElement;
  createElement(tagName: "textarea"): SyntheticHTMLElement;
  createElement(tagName: "tfoot"): SyntheticHTMLElement;
  createElement(tagName: "th"): SyntheticHTMLElement;
  createElement(tagName: "thead"): SyntheticHTMLElement;
  createElement(tagName: "time"): SyntheticHTMLElement;
  createElement(tagName: "title"): SyntheticHTMLElement;
  createElement(tagName: "tr"): SyntheticHTMLElement;
  createElement(tagName: "track"): SyntheticHTMLElement;
  createElement(tagName: "tt"): SyntheticHTMLElement;
  createElement(tagName: "u"): SyntheticHTMLElement;
  createElement(tagName: "ul"): SyntheticHTMLElement;
  createElement(tagName: "var"): SyntheticHTMLElement;
  createElement(tagName: "video"): SyntheticHTMLElement;
  createElement(tagName: "wbr"): SyntheticHTMLElement;
  createElement(tagName: "a"): SyntheticHTMLElement;
  createElement(tagName: "abbr"): SyntheticHTMLElement;
  createElement(tagName: "acronym"): SyntheticHTMLElement;
  createElement(tagName: "address"): SyntheticHTMLElement;
  createElement(tagName: "applet"): SyntheticHTMLElement;
  createElement(tagName: "area"): SyntheticHTMLElement;
  createElement(tagName: "article"): SyntheticHTMLElement;
  createElement(tagName: "aside"): SyntheticHTMLElement;
  createElement(tagName: "audio"): SyntheticHTMLElement;
  createElement(tagName: "b"): SyntheticHTMLElement;
  createElement(tagName: "base"): SyntheticHTMLElement;
  createElement(tagName: "basefont"): SyntheticHTMLElement;
  createElement(tagName: "bdi"): SyntheticHTMLElement;
  createElement(tagName: "bdo"): SyntheticHTMLElement;
  createElement(tagName: "big"): SyntheticHTMLElement;
  createElement(tagName: "blockquote"): SyntheticHTMLElement;
  createElement(tagName: "body"): SyntheticHTMLElement;
  createElement(tagName: "br"): SyntheticHTMLElement;
  createElement(tagName: "button"): SyntheticHTMLElement;
  createElement(tagName: "canvas"): SyntheticHTMLElement;
  createElement(tagName: "caption"): SyntheticHTMLElement;
  createElement(tagName: "center"): SyntheticHTMLElement;
  createElement(tagName: "cite"): SyntheticHTMLElement;
  createElement(tagName: "code"): SyntheticHTMLElement;
  createElement(tagName: "col"): SyntheticHTMLElement;
  createElement(tagName: "colgroup"): SyntheticHTMLElement;
  createElement(tagName: "datalist"): SyntheticHTMLElement;
  createElement(tagName: "dd"): SyntheticHTMLElement;
  createElement(tagName: "del"): SyntheticHTMLElement;
  createElement(tagName: "details"): SyntheticHTMLElement;
  createElement(tagName: "dfn"): SyntheticHTMLElement;
  createElement(tagName: "dialog"): SyntheticHTMLElement;
  createElement(tagName: "dir"): SyntheticHTMLElement;
  createElement(tagName: "div"): SyntheticHTMLElement;
  createElement(tagName: "dl"): SyntheticHTMLElement;
  createElement(tagName: "dt"): SyntheticHTMLElement;
  createElement(tagName: "em"): SyntheticHTMLElement;
  createElement(tagName: "embed"): SyntheticHTMLElement;
  createElement(tagName: "fieldset"): SyntheticHTMLElement;
  createElement(tagName: "figcaption"): SyntheticHTMLElement;
  createElement(tagName: "figure"): SyntheticHTMLElement;
  createElement(tagName: "font"): SyntheticHTMLElement;
  createElement(tagName: "footer"): SyntheticHTMLElement;
  createElement(tagName: "form"): SyntheticHTMLElement;
  createElement(tagName: "frame"): SyntheticHTMLElement;
  createElement(tagName: "frameset"): SyntheticHTMLElement;
  createElement(tagName: "head"): SyntheticHTMLElement;
  createElement(tagName: "header"): SyntheticHTMLElement;
  createElement(tagName: "hr"): SyntheticHTMLElement;
  createElement(tagName: "html"): SyntheticHTMLElement;
  createElement(tagName: "i"): SyntheticHTMLElement;
  createElement(tagName: "iframe"): SyntheticHTMLElement;
  createElement(tagName: "img"): SyntheticHTMLElement;
  createElement(tagName: "input"): SyntheticHTMLElement;
  createElement(tagName: "ins"): SyntheticHTMLElement;
  createElement(tagName: "kbd"): SyntheticHTMLElement;
  createElement(tagName: "keygen"): SyntheticHTMLElement;
  createElement(tagName: "label"): SyntheticHTMLElement;
  createElement(tagName: "legend"): SyntheticHTMLElement;
  createElement(tagName: "li"): SyntheticHTMLElement;
  createElement(tagName: "link"): SyntheticHTMLElement;
  createElement(tagName: "main"): SyntheticHTMLElement;
  createElement(tagName: "map"): SyntheticHTMLElement;
  createElement(tagName: "mark"): SyntheticHTMLElement;
  createElement(tagName: "menu"): SyntheticHTMLElement;
  createElement(tagName: "WebMenuItem"): SyntheticHTMLElement;
  createElement(tagName: "meta"): SyntheticHTMLElement;
  createElement(tagName: "meter"): SyntheticHTMLElement;
  createElement(tagName: "nav"): SyntheticHTMLElement;
  createElement(tagName: "noframes"): SyntheticHTMLElement;
  createElement(tagName: "noscript"): SyntheticHTMLElement;
  createElement(tagName: "object"): SyntheticHTMLElement;
  createElement(tagName: "ol"): SyntheticHTMLElement;
  createElement(tagName: "optgroup"): SyntheticHTMLElement;
  createElement(tagName: "option"): SyntheticHTMLElement;
  createElement(tagName: "output"): SyntheticHTMLElement;
  createElement(tagName: "p"): SyntheticHTMLElement;
  createElement(tagName: "param"): SyntheticHTMLElement;
  createElement(tagName: "pre"): SyntheticHTMLElement;
  createElement(tagName: "progress"): SyntheticHTMLElement;
  createElement(tagName: "q"): SyntheticHTMLElement;
  createElement(tagName: "rp"): SyntheticHTMLElement;
  createElement(tagName: "rt"): SyntheticHTMLElement;
  createElement(tagName: "ruby"): SyntheticHTMLElement;
  createElement(tagName: "s"): SyntheticHTMLElement;
  createElement(tagName: "samp"): SyntheticHTMLElement;
  createElement(tagName: "script"): SyntheticHTMLElement;
  createElement(tagName: "section"): SyntheticHTMLElement;
  createElement(tagName: "select"): SyntheticHTMLElement;
  createElement(tagName: "small"): SyntheticHTMLElement;
  createElement(tagName: "source"): SyntheticHTMLElement;
  createElement(tagName: "span"): SyntheticHTMLElement;
  createElement(tagName: "strike"): SyntheticHTMLElement;
  createElement(tagName: "strong"): SyntheticHTMLElement;
  createElement(tagName: "style"): SyntheticHTMLElement;
  createElement(tagName: "sub"): SyntheticHTMLElement;
  createElement(tagName: "summary"): SyntheticHTMLElement;
  createElement(tagName: "sup"): SyntheticHTMLElement;
  createElement(tagName: "table"): SyntheticHTMLElement;
  createElement(tagName: "tbody"): SyntheticHTMLElement;
  createElement(tagName: "td"): SyntheticHTMLElement;
  createElement(tagName: "textarea"): SyntheticHTMLElement;
  createElement(tagName: "tfoot"): SyntheticHTMLElement;
  createElement(tagName: "th"): SyntheticHTMLElement;
  createElement(tagName: "thead"): SyntheticHTMLElement;
  createElement(tagName: "time"): SyntheticHTMLElement;
  createElement(tagName: "title"): SyntheticHTMLElement;
  createElement(tagName: "tr"): SyntheticHTMLElement;
  createElement(tagName: "track"): SyntheticHTMLElement;
  createElement(tagName: "tt"): SyntheticHTMLElement;
  createElement(tagName: "u"): SyntheticHTMLElement;
  createElement(tagName: "ul"): SyntheticHTMLElement;
  createElement(tagName: "var"): SyntheticHTMLElement;
  createElement(tagName: "video"): SyntheticHTMLElement;
  createElement(tagName: "wbr"): SyntheticHTMLElement;
  createElement(unknownTagName: any): SyntheticHTMLElement;

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
