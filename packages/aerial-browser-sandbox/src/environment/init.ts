import parse5 = require("parse5");
import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "./constants";
import { Fetch, getSEnvWindowClass } from "./window";

export type SyntheticWindowEnvironmentOptions = {
  fetch: Fetch
};

export const openSyntheticEnvironmentWindow = (location: string, { fetch }: SyntheticWindowEnvironmentOptions) => {
  const SEnvWindow = getSEnvWindowClass({});
  const window = new SEnvWindow(null, location, null);
  window.fetch = fetch;
  loadSyntheticWindow(window);
  return window;
}

const loadSyntheticWindow = async (window: Window) =>{
  const response = await window.fetch(window.location.origin);
  const content  = await response.text();
  await loadDocument(window, window.document, parseHTML(content));
};

const loadDocument = async (window: Window, document: Document, expression: parse5.AST.Default.Document) => {
  for (const childExpression of expression.childNodes) {
    document.appendChild(await loadNode(document, childExpression));
  }
};

const loadNode = async (document: Document, expression: parse5.AST.Default.Node) => {
  const node = createNode(document, expression);
  if (node.nodeType === SEnvNodeTypes.ELEMENT) {
    await loadChildNodes(node as Element, expression as parse5.AST.Default.Element);
  }
  return node;
};

const loadChildNodes = async (parentElement: Element, expression: parse5.AST.Default.ParentNode) => {
  for (const childExpression of expression.childNodes) {
    parentElement.appendChild(await loadNode(parentElement.ownerDocument, childExpression));
  }
};

const createNode = (document: Document, expression: parse5.AST.Default.Node) => {
  switch(expression.nodeName) {
    case "#text": {
      return document.createTextNode((expression as parse5.AST.Default.TextNode).value);
    }
    case "#comment": {
      return document.createComment((expression as parse5.AST.Default.CommentNode).data);
    }
    case "#documentType": {
      return document.createTextNode("");
    }
    default: {
      const elementExpression = expression as parse5.AST.Default.Element;
      const element = document.createElement(elementExpression.nodeName);
      for (let i = 0, n = elementExpression.attrs.length; i < n; i++) {
        const attributeExpression = elementExpression.attrs[i];
        element.setAttribute(attributeExpression.name, attributeExpression.value);
      }
      return element;
    }
  }
};

const parseHTML = weakMemo((content: string) => {
  const ast = parse5.parse(content, { locationInfo: true });
  return ast as parse5.AST.Default.Document;
});