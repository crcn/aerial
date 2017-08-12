import parse5 = require("parse5");
import { weakMemo } from "aerial-common2";
import { SEnvNodeTypes } from "../constants";
import { SEnvNodeInterface } from "./node";
import { SEnvDocumentInterface } from "./document";
import { SEnvWindowInterface } from "../window";
import { SEnvParentNodeInterface } from "./parent-node";

export const parseHTMLDocument = weakMemo((content: string) => {
  const ast = parse5.parse(content, { locationInfo: true });
  return ast as parse5.AST.Default.Document;
});

export const saxParseHTMLDocument = (content: string) => {
  const parser = new parse5.SAXParser({ locationInfo: true });
};

export const consumeDocumentSaxParser = (parser: parse5.SAXParser, root: Node) => {

}

export const consumeSaxParser = (parser: parse5.SAXParser, root: SEnvNodeInterface) => {

  let cpath: SEnvNodeInterface[] = [root];
  let current: SEnvNodeInterface = root;
  const document = (root.nodeType === SEnvNodeTypes.DOCUMENT ? root : root.ownerDocument) as SEnvDocumentInterface;

  parser.on("startTag", (name, attrs, selfClosing, location) => {
    const element = addNodeSource(document.$createElementWithoutConstruct(name), location);
    current.appendChild(element);
  
    
    for (const attr of attrs) {
      element.setAttribute(attr.name, attr.value);
    }

    if (selfClosing) {
      constructNode(element);
    }

    if (!selfClosing) {
      cpath.push(current = element);
    }
  });

  parser.on("endTag", async (name, location) => {
    parser.pause();
    const ended = cpath.pop();
    current = cpath[cpath.length - 1];
    constructNode(ended);
    await ended.contentLoaded;
    parser.resume();
  });

  parser.on("text", (text, location) => {
    const node = addNodeSource(document.createTextNode(text), location);
    current.appendChild(node);
  });

  parser.on("comment", (text, location) => {
    const node = addNodeSource(document.createComment(text), location);
    current.appendChild(node);
  });
  
};

export const parseHTMLDocumentFragment = weakMemo((content: string) => {
  const ast = parse5.parseFragment(content, { locationInfo: true });
  return ast as parse5.AST.Default.DocumentFragment;
});

export const constructNode = <T extends Node>(node: T) => {
  if (node["$$constructed"]) throw new Error("Cannot call constructor multiple times on a class");
  node["$$constructed"] = true;
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

export const evaluateHTMLDocumentFragment = (source: string, document: SEnvDocumentInterface) => mapExpressionToNode(parseHTMLDocumentFragment(source), document);

const getHTMLASTNodeLocation = (expression: parse5.AST.Default.CommentNode|parse5.AST.Default.Element|parse5.AST.Default.TextNode|any) => {
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
    uri: node.ownerDocument && node.ownerDocument.defaultView.location.origin,
    start: start
  };
  return node;
}

export const mapExpressionToNode = (expression: parse5.AST.Default.Node, document: SEnvDocumentInterface, parentNode?: SEnvParentNodeInterface) => {
  switch(expression.nodeName) {
    case "#document-fragment": {
      const fragmentExpression = expression as parse5.AST.Default.DocumentFragment;
      const fragment = document.createDocumentFragment();
      for (const childExpression of fragmentExpression.childNodes) {
        mapExpressionToNode(childExpression, document, fragment);
      }
      addNodeSource(fragment, expression);
      if (parentNode) {
        parentNode.appendChild(fragment);
      }
      return fragment;
    } 
    case "#text": {
      const text = addNodeSource(document.createTextNode((expression as parse5.AST.Default.TextNode).value), expression);
      if (parentNode) {
        parentNode.appendChild(text);
      }
      return text;
    }
    case "#comment": {
      const comment = addNodeSource(document.createComment((expression as parse5.AST.Default.CommentNode).data), expression);
      if (parentNode) {
        parentNode.appendChild(comment);
      }
      return comment;
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
      addNodeSource(element, expression);
      if (parentNode) {
        parentNode.appendChild(element);
      }
      for (const childExpression of elementExpression.childNodes) {
        constructNode(mapExpressionToNode(childExpression, document, element));
      }
      return element;
    }
  }
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