import parse5 = require("parse5");
import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";
import { SEnvDocumentAddon } from "./document";

export const parseHTMLDocument = weakMemo((content: string) => {
  const ast = parse5.parse(content, { locationInfo: true });
  return ast as parse5.AST.Default.Document;
});

export const parseHTMLDocumentFragment = weakMemo((content: string) => {
  const ast = parse5.parseFragment(content, { locationInfo: true });
  return ast as parse5.AST.Default.DocumentFragment;
});

export const constructNodeTree = <T extends Node>(parentNode: T) => {
  for (const child of Array.prototype.slice.call(parentNode.childNodes)) {
    constructNodeTree(child);
  }
  if (parentNode.nodeType ===  SEnvNodeTypes.ELEMENT) {
    parentNode.constructor.call(parentNode);
  }
  return parentNode;
}

export const evaluateHTMLDocumentFragment = (source: string, document: SEnvDocumentAddon) => constructNodeTree(mapExpressionToNode(parseHTMLDocumentFragment(source), document));

export const mapExpressionToNode = (expression: parse5.AST.Default.Node, document: SEnvDocumentAddon) => {
  switch(expression.nodeName) {
    case "#document-fragment": {
      const fragmentExpression = expression as parse5.AST.Default.DocumentFragment;
      const fragment = document.createDocumentFragment();
      for (const childExpression of fragmentExpression.childNodes) {
        fragment.appendChild(mapExpressionToNode(childExpression, document));
      }
      return fragment;
    } 
    case "#text": {
      return document.createTextNode((expression as parse5.AST.Default.TextNode).value);
    }
    case "#comment": {
      return document.createComment((expression as parse5.AST.Default.CommentNode).data);
    }
    case "#documentType": {
      return null;
    }
    default: {
      const elementExpression = expression as parse5.AST.Default.Element;
      const element = document.$createElementWithoutConstruct(elementExpression.nodeName);
      for (const attr of elementExpression.attrs) {
        element.setAttribute(attr.name, attr.value);
      }
      for (const childExpression of elementExpression.childNodes) {
        element.appendChild(mapExpressionToNode(childExpression, document));
      }
      return element;
    }
  }
};