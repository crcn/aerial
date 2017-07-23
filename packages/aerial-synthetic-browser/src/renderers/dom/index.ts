import assert = require("assert");
import { decode } from "ent";
import { camelCase } from "lodash";
import { BaseRenderer } from "../base";
import { CallbackBus } from "mesh7";
import {
  HTML_XMLNS,
  SVG_XMLNS,
  SVG_TAG_NAMES,
  HTML_VOID_ELEMENTS,
  SyntheticDOMElementMutationTypes,
  SyntheticDOMValueNodeMutationTypes
} from "../../dom";

import {
  bindable,
  isMaster,
  Mutation,
  diffArray,
  flattenTree,
  BoundingRect,
  traverseTree,
  MutationEvent,
  watchProperty,
  RemoveMutation,
  PropertyMutation,
  MoveChildMutation,
  InsertChildMutation,
  RemoveChildMutation,
  TreeNodeMutationTypes,
  calculateAbsoluteBounds
} from "aerial-common";

import {
  DOMNodeType,
  isCSSMutation,
  SyntheticDOMNode,
  SyntheticDOMText,
  DOMElementEditor,
  SyntheticDocument,
  isDOMNodeMutation,
  SyntheticCSSStyle,
  SyntheticCSSObject,
  DOMValueNodeEditor,
  DOMContainerEditor,
  SyntheticMouseEvent,
  CSSStyleRuleEditor,
  isCSSAtRuleMutaton,
  SyntheticDOMElement,
  CSSStyleSheetEditor,
  SyntheticDOMComment,
  isDOMElementMutation,
  syntheticCSSRuleType,
  CSSGroupingRuleEditor,
  SyntheticDOMValueNode,
  SyntheticDOMContainer,
  isDOMContainerMutation,
  isDOMDocumentMutation,
  isDOMValueNodeMutation,
  isCSSStyleRuleMutation,
  SyntheticKeyboardEvent,
  SyntheticCSSGroupAtRule,
  SyntheticCSSStyleSheet,
  SyntheticCSSGroupingRule,
  isCSSGroupingStyleMutation,
  CSSGroupingRuleMutationTypes,
  SyntheticCSSElementStyleRule,
  SyntheticDocumentMutationTypes,
  SyntheticCSSElementStyleRuleMutationTypes,
} from "../../dom";

import { DOMNodeEvent } from "../../messages";

type HTMLElementDictionaryType = {
  [IDentifier: string]: [Node, SyntheticDOMNode]
}
const ss: CSSStyleSheet = null;

type CSSRuleDictionaryType = {
  [IDentifier: string]: [CSSRule|CSSStyleSheet, syntheticCSSRuleType|SyntheticCSSStyleSheet]
}

function getHostStylesheets(node: Node) {
  let p = node.parentNode;
  while(p.parentNode) p = p.parentNode;

  return (<Document>p).styleSheets || [];
}

function filterInvalidMediaRules(rules: SyntheticCSSGroupAtRule[]) {

}

const parsePx = (unit) => {
  const v = Number(unit && unit.replace(/[a-z]+/g, "") || 0);
  return isNaN(v) ? 0 : v;
}

const calculateSyntheticBoundingRect = (style: SyntheticCSSStyle) => {
  const { width, height, left, top } = style;
  let lp  = parsePx(left);
  let tp  = parsePx(top);
  let rp  = lp + parsePx(width);
  let bp  = tp + parsePx(height);
  return new BoundingRect(lp, tp, rp, bp);
}

export interface ISyntheticDOMRendererOptions {
  nodeFactory?: Document;
  getComputedStyle?: (node: Node) => CSSStyleDeclaration;
  createProxyUrl?: (url: string) => string;
}

export class SyntheticDOMRenderer extends BaseRenderer {

  private _currentCSSText: string;
  private _firstRender: boolean;
  private _documentElement: HTMLElement;
  private _elementDictionary: HTMLElementDictionaryType;
  private _cssRuleDictionary: CSSRuleDictionaryType;
  private _getComputedStyle: (node: Node) => CSSStyleDeclaration|SyntheticCSSStyle;
  private _createProxyUrl: (url: string) => string;

  constructor({ nodeFactory, getComputedStyle, createProxyUrl }: ISyntheticDOMRendererOptions = {}) {
    super(nodeFactory);
    this._createProxyUrl = createProxyUrl;
    this._getComputedStyle = getComputedStyle || (typeof window !== "undefined" ? window.getComputedStyle.bind(window) : () => { });
  }

  createElement() {
    const element = this.nodeFactory.createElement("div");
    element.innerHTML = this.createElementInnerHTML();
    return element;
  }

  createElementInnerHTML() {
    return "<span></span><div></div>";
  }

  protected onDocumentMutationEvent({ mutation }: MutationEvent<any>) {
    super.onDocumentMutationEvent(arguments[0]);

    if (isDOMNodeMutation(mutation)) {
      const [nativeNode, syntheticNode] = this.getElementDictItem(mutation.target);

      const insertChild = (syntheticNode) => {
        return renderHTMLNode(this.nodeFactory, syntheticNode, this._elementDictionary, this.onElementChange, this._createProxyUrl);
      };

      if (nativeNode) {
        if (isDOMElementMutation(mutation)) {
          new DOMElementEditor(<HTMLElement>nativeNode, insertChild).applyMutations([mutation]);
        } else if(isDOMContainerMutation(mutation)) {
          new DOMContainerEditor(<DocumentFragment>nativeNode, insertChild).applyMutations([mutation]);
        } else if(isDOMValueNodeMutation(mutation)) {
          new DOMValueNodeEditor(<Text>nativeNode).applyMutations([mutation]);
        }

        if (isDOMDocumentMutation(mutation)) {
          if (mutation.type === SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT) {
            this.removeCSSRules((<RemoveChildMutation<any, any>>mutation).child);      
          } else if (mutation.type === SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT) {
            const moveMutation = <MoveChildMutation<any, any>>mutation;

          } else if (mutation.type === SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT) {
            const insertMutation = <InsertChildMutation<any, any>>mutation;
            this._registerStyleSheet(insertMutation.child, insertMutation.index);
          }
        }
      }
    }

    if (isCSSMutation(mutation)) {
      const styleSheet = mutation.target instanceof SyntheticCSSStyleSheet ? mutation.target : mutation.target.parentStyleSheet;
      const [nativeRule, syntheticRule] = this.getCSSDictItem(styleSheet);

      // MUST replace the entire CSS text here since vendor prefixes get stripped out
      // depending on the browser. This is the simplest method for syncing changes.
      if (nativeRule) {
        this.updateCSSRules(nativeRule as any as CSSStyleSheet, styleSheet);
      } else {
        // this.logger.warn(`Unable to find matching declaration`);
      }
    }
  }

  private updateCSSRules(staleStyleSheet: CSSStyleSheet, syntheticStyleSheet: SyntheticCSSStyleSheet) {
    while (staleStyleSheet.rules.length) {
      staleStyleSheet.deleteRule(0);
    }

    for (const rule of syntheticStyleSheet.cssRules) {
      try {
        staleStyleSheet.insertRule(this.proxyCSSUrls(rule.cssText), staleStyleSheet.cssRules.length);
      } catch(e) {
        // browser may throw errors if it cannot parse the rule -- this will
        // happen unsupported vendor prefixes.
      }
    }
  }

  private proxyCSSUrls(text: string) {
    return this._createProxyUrl ? text.replace(/url\((.*?)\)/g, (match, url) => {
      return `url("${this._createProxyUrl(url).replace(/["']/g, "")}")`;
    }): text;
  }

  private removeCSSRules(syntheticStyleSheet: SyntheticCSSStyleSheet) {
    const [nativeRule, syntheticRule] = this.getCSSDictItem(syntheticStyleSheet);
    if (!nativeRule) return;
    nativeRule.ownerNode.parentNode.removeChild(nativeRule.ownerNode);
    this._cssRuleDictionary[syntheticStyleSheet.uid] = undefined;
  }

  private getSyntheticStyleSheetIndex(styleSheet: SyntheticCSSObject) {
    return this.document.styleSheets.findIndex(ss => ss.uid === styleSheet.uid);
  }

  private getSyntheticStyleSheet(styleSheet: SyntheticCSSObject) {
    return this.document.styleSheets[this.getSyntheticStyleSheetIndex(styleSheet)];
  }

  private getNativeRuleIndex(index: number) {
    this.document.styleSheets.slice(index + 1).forEach((ss) => {
      index += ss.rules.length;
    });
    return index;
  }

  protected getElementDictItem<T extends Node, U extends SyntheticDOMNode>(synthetic: SyntheticDOMNode): [T, U] {
    return this._elementDictionary && this._elementDictionary[synthetic.uid] || [undefined, undefined] as any;
  }

  private _registerStyleSheet(syntheticStyleSheet: SyntheticCSSStyleSheet, index = Number.MAX_SAFE_INTEGER) {
     const styleElement = this.nodeFactory.createElement("style");
    styleElement.setAttribute("type", "text/css");
    styleElement.textContent = syntheticStyleSheet.cssText;
    const styleContainer = this.element.firstChild;

    if (index > styleContainer.childNodes.length) {
      styleContainer.appendChild(styleElement);
    } else {
      styleContainer.insertBefore(styleElement, styleContainer.childNodes[index]);
    }

    return new Promise((resolve) => {
      const tryRegistering = () => {
        this.tryRegisteringStyleSheet(styleElement, syntheticStyleSheet).then(() => resolve(styleElement), () => {
          setTimeout(tryRegistering, 20);
        });
      }
      setImmediate(tryRegistering);
    });
  }

  protected async render() {
    const { document, element } = this;

    if (!this._documentElement) {
      await Promise.all(document.styleSheets.map((styleSheet) => {
        return this._registerStyleSheet(styleSheet);
      }).concat((new Promise(resolve => {
        this._documentElement = renderHTMLNode(this.nodeFactory, document, this._elementDictionary = {}, this.onElementChange, this._createProxyUrl);
        element.lastChild.appendChild(this._documentElement);
        resolve();
      }))));
    }

    this.updateRects();
  }

  private onElementChange = () => {
    this.requestRender();
  }

  private getCSSDictItem(target: SyntheticCSSObject): [CSSStyleSheet, syntheticCSSRuleType] {
    return (this._cssRuleDictionary && this._cssRuleDictionary[target.uid]) || [undefined, undefined] as any;
  }

  private tryRegisteringStyleSheet(styleElement: HTMLStyleElement, styleSheet: SyntheticCSSStyleSheet) {

    const nativeStyleSheet = Array.prototype.slice.call(getHostStylesheets(styleElement)).find((styleSheet: CSSStyleSheet) => {
      return styleSheet.ownerNode === styleElement;
    });

    if (!nativeStyleSheet) {
      return Promise.reject(new Error(`Cannot find native style sheet generated by DOM renderer.`));
    }

    this._cssRuleDictionary[styleSheet.uid] = [nativeStyleSheet, styleSheet];

    return Promise.resolve();
  }

  protected reset() {
    this._documentElement = undefined;
    this._cssRuleDictionary = {};
    this._elementDictionary = {};
    const { element } = this;

    if (element) {
      element.innerHTML = this.createElementInnerHTML();
      element.onclick = 
      element.ondblclick = 
      element.onmousedown =
      element.onmouseenter = 
      element.onmouseleave = 
      element.onmousemove  = 
      element.onmouseout = 
      element.onmouseover = 
      element.onmouseup =
      element.onmousewheel = 
      element.onkeydown = 
      element.onkeypress = 
      element.onkeyup = (event: any) => {
        for (let uid in this._elementDictionary) {
          const [native, synthetic] = this._elementDictionary[uid];
          if (native === event.target) {
            this.onDOMEvent(synthetic as SyntheticDOMElement, event);
          }
        }
      }
    }
  }

  private onDOMEvent (element: SyntheticDOMElement, event: any) {

    // TODO - add more data here
    if (event.constructor.name === "MouseEvent") {
      element.dispatchEvent(new SyntheticMouseEvent(event.type));
    } else if (event.constructor.name === "KeyboardEvent") {
      element.dispatchEvent(new SyntheticKeyboardEvent(event.type));
    }
  }

  private updateRects() {
    const syntheticDOMNodesByUID = {};
    const rects  = {};
    const styles = {};


    for (let uid in this._elementDictionary) {
      const [native, synthetic] = this._elementDictionary[uid] || [undefined, undefined];

      const syntheticNode: SyntheticDOMNode = <SyntheticDOMNode>synthetic;
      if (syntheticNode && syntheticNode.nodeType === DOMNodeType.ELEMENT) {

        const nativeStyle = this._getComputedStyle(native);

        const rect = typeof window !== "undefined" && window["$synthetic"] ? calculateSyntheticBoundingRect(nativeStyle as SyntheticCSSStyle) : BoundingRect.fromClientRect((<Element>native).getBoundingClientRect());
        
        if (rect.width || rect.height || rect.left || rect.top) {
          rects[uid] = rect;
        }

        // just attach whatever's returned by the DOM -- don't wrap this in a synthetic, or else
        // there'll be massive performance penalties.
        styles[uid] = nativeStyle;
        (<SyntheticDOMNode>syntheticNode).attachNative(native);
      }
    }

    this.setRects(rects, styles);
  }
}

function renderHTMLNode(nodeFactory: Document, syntheticNode: SyntheticDOMNode, dict: HTMLElementDictionaryType, onChange: () => any, createProxyUrl: (string) => string): any {
  switch(syntheticNode.nodeType) {

    case DOMNodeType.TEXT:
      const textNode = nodeFactory.createTextNode(decode(String(syntheticNode.textContent)));
      dict[syntheticNode.uid] = [textNode, syntheticNode];
      return textNode;

    case DOMNodeType.COMMENT:
      const comment = nodeFactory.createComment((<SyntheticDOMComment>syntheticNode).nodeValue);
      return comment;

    case DOMNodeType.ELEMENT:
      const syntheticElement = <SyntheticDOMElement>syntheticNode;

      // add a placeholder for these blacklisted elements so that diffing & patching work properly
      
      if(/^(style|link|script)$/.test(syntheticElement.nodeName)) return nodeFactory.createTextNode("");
      
      const element = renderHTMLElement(nodeFactory, syntheticElement.nodeName, syntheticElement, dict, onChange, createProxyUrl);

      element.onload = onChange;
      for (let i = 0, n = syntheticElement.attributes.length; i < n; i++) {
        const syntheticAttribute = syntheticElement.attributes[i];
        if (syntheticAttribute.name === "class") {
          element.className = syntheticAttribute.value;
        } else {

          // some cases where the attribute name may be invalid - especially as the app is updating
          // as the user is typing. E.g: <i </body> will be parsed, but will thrown an error since "<" will be
          // defined as an attribute of <i>
          try {
            let value = syntheticAttribute.value;

            if (createProxyUrl && /src/.test(syntheticAttribute.name)) {
              value = createProxyUrl(value);
            }

            element.setAttribute(syntheticAttribute.name, value);
          } catch(e) {
            console.warn(e.stack);
          }
        }
      }
      return appendChildNodes(nodeFactory, element, syntheticElement.childNodes, dict, onChange, createProxyUrl);
    case DOMNodeType.DOCUMENT:
    case DOMNodeType.DOCUMENT_FRAGMENT:
      const syntheticContainer = <SyntheticDOMContainer>syntheticNode;
      const containerElement = renderHTMLElement(nodeFactory, "span", syntheticContainer as SyntheticDOMElement, dict, onChange, createProxyUrl);
      return appendChildNodes(nodeFactory, containerElement, syntheticContainer.childNodes, dict, onChange, createProxyUrl);
  }
}

function renderHTMLElement(nodeFactory: Document, tagName: string, source: SyntheticDOMElement, dict: HTMLElementDictionaryType, onChange: () => any, createProxyUrl: (string) => string): HTMLElement {
  if (/^(html|body|head)$/.test(tagName)) tagName = "div";
  const element = nodeFactory.createElementNS(source.namespaceURI === SVG_XMLNS ? SVG_XMLNS : HTML_XMLNS, tagName) as HTMLElement;
  
  if (source.shadowRoot) {
    appendChildNodes(nodeFactory, element.attachShadow({ mode: "open" }), source.shadowRoot.childNodes, dict, onChange, createProxyUrl);
  }
  dict[source.uid] = [element, source];
  return element as any;
}

function appendChildNodes(nodeFactory: Document, container: HTMLElement|DocumentFragment, syntheticChildNodes: SyntheticDOMNode[], dict: HTMLElementDictionaryType, onChange: () => any, createProxyUrl: (string) => string) {
  for (let i = 0, n = syntheticChildNodes.length; i < n; i++) {
    const childNode = renderHTMLNode(nodeFactory, syntheticChildNodes[i], dict, onChange, createProxyUrl);

    // ignored
    if (childNode == null) continue;
    container.appendChild(childNode);
  }
  return container;
}
