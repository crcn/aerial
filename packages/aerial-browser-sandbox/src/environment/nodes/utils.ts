// TODO - break this into other util files

import parse5 = require("parse5");
import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";
import { SEnvNodeInterface } from "./node";
import { SEnvDocumentInterface } from "./document";
import { SEnvWindowInterface } from "../window";
import { SEnvParentNodeInterface } from "./parent-node";
import { SEnvHTMLElementInterface } from "./html-elements";
const VOID_ELEMENTS = require("void-elements");

export const parseHTMLDocument = weakMemo((content: string) => {
  const ast = parse5.parse(content, { locationInfo: true });
  return ast as parse5.AST.Default.Document;
});

export const parseHTMLDocumentFragment = weakMemo((content: string) => {
  const ast = parse5.parseFragment(content, { locationInfo: true });
  return ast as parse5.AST.Default.DocumentFragment;
});

export const constructNode = <T extends Node>(node: T) => {
  if (node.nodeType ===  SEnvNodeTypes.ELEMENT) {
    node.constructor.call(node);
  }
  return node;
}

export const constructNodeTree = <T extends Node>(parentNode: T) => {
  for (const child of Array.prototype.slice.call(parentNode.childNodes)) {
    constructNodeTree(child);
  }
  return constructNode(parentNode);
}

export const evaluateHTMLDocumentFragment = (source: string, document: SEnvDocumentInterface, parentNode: SEnvParentNodeInterface) => mapExpressionToNode(parseHTMLDocumentFragment(source), document, parentNode);

export const getHTMLASTNodeLocation = (expression: parse5.AST.Default.CommentNode|parse5.AST.Default.Element|parse5.AST.Default.TextNode|any) => {
  const loc = expression.__location as any;
  if (!loc) return undefined;
  if ((loc as parse5.MarkupData.ElementLocation).startTag) {
    return { line: loc.startTag.line, column: loc.startTag.col }
  } else {
    return { line: loc.line, column: loc.col };
  }
}

const addNodeSource = <T extends SEnvNodeInterface>(node: T, expressionOrLocation) => {
  const start = expressionOrLocation.__location ? getHTMLASTNodeLocation(expressionOrLocation) : { line: expressionOrLocation.line, column: expressionOrLocation.col };
  node.source = {
    uri: node.ownerDocument && node.ownerDocument.defaultView.location.toString(),
    start: start
  };
  return node;
}

let p = Promise.resolve().then(() => {
  return new Promise((resolve) => {
    
  });
})

export const mapChildExpressionsToNodes = (promise: Promise<any>, childExpressions: parse5.AST.Default.Node[], document: SEnvDocumentInterface, parentNode: SEnvParentNodeInterface, async: boolean = false) => {
  for (const childExpression of childExpressions) {
    if (async) {
      promise = promise.then(() => {
        const p = mapExpressionToNode(childExpression, document, parentNode as any, async);
        return p;
      });
    } else {
      mapExpressionToNode(childExpression, document, parentNode as any, async);
    }
  }
  return promise;
}

export const mapExpressionToNode = (expression: parse5.AST.Default.Node, document: SEnvDocumentInterface, parentNode: SEnvParentNodeInterface, async: boolean = false) => {
  let promise = Promise.resolve();
  switch(expression.nodeName) {
    case "#document-fragment": {
      const fragmentExpression = expression as parse5.AST.Default.DocumentFragment;
      const fragment = document.createDocumentFragment();
      promise = mapChildExpressionsToNodes(promise, fragmentExpression.childNodes, document, fragment as any, async);
      addNodeSource(fragment, expression);
      parentNode.appendChild(fragment);
      break;
    } 
    case "#text": {
      const textNode = addNodeSource(document.createTextNode((expression as parse5.AST.Default.TextNode).value), expression);
      parentNode.appendChild(textNode);
      break;
    }
    case "#comment": {
      const comment = addNodeSource(document.createComment((expression as parse5.AST.Default.CommentNode).data), expression);
      parentNode.appendChild(comment);
      break;
    }
    case "#documentType": {
      break;
    }
    case "#document": {
      const documentExpression = expression as parse5.AST.Default.Document;
      promise = mapChildExpressionsToNodes(promise, documentExpression.childNodes, document, parentNode, async);
      break;
    }
    default: {
      const elementExpression = expression as parse5.AST.Default.Element;
      const element = document.$createElementWithoutConstruct(elementExpression.nodeName);
      for (const attr of elementExpression.attrs) {
        element.setAttribute(attr.name, attr.value);
      }
      addNodeSource(element as any as SEnvHTMLElementInterface, expression);
      parentNode.appendChild(element);
      promise = mapChildExpressionsToNodes(promise, elementExpression.childNodes, document, element, async);
      if (async) {
        promise = promise.then(() => {
          constructNode(element);
          return element.contentLoaded;
        });
      } else {
        constructNode(element);
      }
    }
  }

  return promise;
};

export const whenLoaded = async (node: SEnvNodeInterface) => {
  await node.interactiveLoaded;
  await Promise.all(
    Array.prototype.map.call(node.childNodes, child => whenLoaded(child))
  );
}

const querySelectorFilter = weakMemo((selector: string) => (node: Node) => {
  return node.nodeType === SEnvNodeTypes.ELEMENT
   && (node.ownerDocument.defaultView as SEnvWindowInterface).selector.match(node, selector);
});

export const querySelector = (node: Node, selector: string) => {
  return findNode(node, querySelectorFilter(selector));
};

export const querySelectorAll = (node: Node, selector: string) => {
  return filterNodes(node, querySelectorFilter(selector));
};

export const findNode = (parent: Node, filter: (child: Node) => boolean) => {
  if (filter(parent)) {
    return parent;
  }
  let found;
  for (const child of Array.prototype.slice.call(parent.childNodes)) {
    found = findNode(child, filter);
    if (found) {
      return found;
    }
  }
};

export const filterNodes = (parent: Node, filter: (child: Node) => boolean, ary: Node[] = []) => {
  if (filter(parent)) {
    ary.push(parent);
  };
  for (const child of Array.prototype.slice.call(parent.childNodes)) {
    filterNodes(child, filter, ary);
  }
  return ary;
};


export function traverseDOMNodeExpression(target: parse5.AST.Default.Node, each: (expression: parse5.AST.Default.Node) => boolean | void) {
  if (target.nodeName === "#document" || target.nodeName === "#document-fragment") {
    
  }
  for (const child of target["childNodes"] || []) {
    if (each(child) === false) return;
    traverseDOMNodeExpression(child, each);
  }
}

export function findDOMNodeExpression(target: parse5.AST.Default.Node, filter: (expression: parse5.AST.Default.Node) => boolean): parse5.AST.Default.Node {
  let found;
  traverseDOMNodeExpression(target, (expression) => {
    if (filter(expression)) {
      found = expression;
      return false;
    }
  });
  return found;
}

export function filterDOMNodeExpressions(target: parse5.AST.Default.Node, filter: (expression: parse5.AST.Default.Node) => boolean): parse5.AST.Default.Node[] {
  let found = [];
  traverseDOMNodeExpression(target, (expression) => {
    if (filter(expression)) {
      found.push(expression);
    }
  });
  return found;
}

