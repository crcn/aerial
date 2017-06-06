import sm = require("source-map");
import { ISourcePosition } from "@tandem/common";
import { DOMNodeType } from "./node-types";
import { SandboxModule } from "@tandem/sandbox";
import { SyntheticDOMNode } from "./node";
import { SyntheticDocument } from "../document";
import { SyntheticDOMContainer } from "./container";
import { SyntheticDocumentFragment } from "./document-fragment";
import { SyntheticDOMAttribute, SyntheticDOMElement } from "./element";
import parse5 = require("parse5");
import { getHTMLASTNodeLocation } from "./parser";

// TODO - this needs to be async
export function evaluateMarkup(expression: parse5.AST.Default.Node, doc: SyntheticDocument, namespaceURI?: string, module?: SandboxModule, parentContainer?: SyntheticDOMContainer): any {


  const source = module && module.source;
  let smg: sm.SourceMapConsumer;
  let fileUri: string;
  
  if (source) {
    fileUri = source.uri;
    if (source.map) {
      smg = new sm.SourceMapConsumer(source.map);
    }
  }
  const stack = new Error().stack;
  const root = expression;
  
  function linkSourceInfo(expression: parse5.AST.Default.Node, synthetic: SyntheticDOMNode) {
    synthetic.$module = module;

    let euri: string = fileUri;

    // may be undefined if setting innerHTML
    let start: ISourcePosition = getHTMLASTNodeLocation(expression) || { line: 1, column: 1 };

    if (smg) {
      const org = smg.originalPositionFor({ line: start.line, column: start.column - 1 });
      start = { line: org.line, column: org.column };
      euri  = org.source;
    }

    synthetic.$source  = {
      uri: euri,
      start: start
    };
    return synthetic;
  }

  function appendChildNodes(container: SyntheticDOMContainer, expression: parse5.AST.Default.Element) {
    for (let i = 0, n = expression.childNodes.length; i < n; i++) {
      const child = evaluateMarkup(expression.childNodes[i], doc, namespaceURI, module, container);
      child.$createdCallback();
    }
  }

  const getAttribute = (expression: parse5.AST.Default.Element, name: string) => {
    const attr = expression.attrs.find((attr) => attr.name === name);
    return attr && attr.value;
  }
  
  const map = (expression: parse5.AST.Default.Node) => {
    
    // nothing for now for doc type
    if (expression.nodeName === "#documentType") {
      const node = doc.createTextNode("");
      linkSourceInfo(expression, node);
      parentContainer.appendChild(node);
      return node;
    } if (expression.nodeName === "#comment") {
      const node = linkSourceInfo(expression, doc.createComment((expression as parse5.AST.Default.CommentNode).data));
      linkSourceInfo(expression, node);
      parentContainer.appendChild(node);
      return node;
    } else if (expression.nodeName === "#text") {
      const value = (expression as parse5.AST.Default.TextNode).value;
      const isWS = /^[\n\r\t ]+$/.test(value);
      const node = doc.createTextNode((expression as parse5.AST.Default.TextNode).value);
      if (!isWS) {
        linkSourceInfo(expression, node);
        parentContainer.appendChild(node);
      }
      return node;
    } else if (expression.nodeName === "#document" || expression.nodeName === "#document-fragment") {

      let container: SyntheticDOMContainer;

      if (!(expression as parse5.AST.Default.Element).parentNode && parentContainer) {
        container = parentContainer;
      } else {
        container = doc.createDocumentFragment();
        linkSourceInfo(expression, container);
      }

      appendChildNodes(container, expression as parse5.AST.Default.Element);

      if (container !== parentContainer) {
        container.$createdCallback();
      }

      return container;
    }

    const elementExpression = expression as parse5.AST.Default.Element;

    const xmlns = getAttribute(elementExpression, "xmlns") || namespaceURI || doc.defaultNamespaceURI;

    // bypass $createdCallback executed by document
    const elementClass = doc.$getElementClassNS(xmlns, expression.nodeName);
    const element = new elementClass(xmlns, expression.nodeName);
    element.$setOwnerDocument(doc);
    parentContainer.appendChild(element);

    for (let i = 0, n = elementExpression.attrs.length; i < n; i++) {
      const attributeExpression = elementExpression.attrs[i];
      element.setAttribute(attributeExpression.name, attributeExpression.value);
    }

    linkSourceInfo(expression, element);
    appendChildNodes(element, elementExpression);

    return element;
  }

  return map(expression);
}
