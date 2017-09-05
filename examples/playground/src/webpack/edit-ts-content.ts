import ts =  require("typescript");

import { 
  Mutation, 
  StringMutation, 
  ExpressionLocation,
  SetPropertyMutation,
  createStringMutation,
} from "aerial-common2";

import {
  SyntheticDOMElementMutationTypes
} from "aerial-browser-sandbox";

module.exports = (content: string, mutation: Mutation<any>, filePath: string) => {
  const source = mutation.target.source;
  const ast = ts.createSourceFile(filePath, content, ts.ScriptTarget.ES2016, true);
  const targetNode = findTargetASTNode(ast, mutation);

  switch(mutation.$type) {
    case SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT: {
      return editElementAttribute(targetNode, mutation as SetPropertyMutation<any>);
    }
  }

  // nothing
  return createStringMutation(0, 0, "");
}

const alternativeAttrName = (name: string) => {
  return {
    class: "className"
  }[name] || name;
}

const transformAttrValue = (name: string, value: string) => {
  if (name === "style") {
    const style = {};
    value.split(";").forEach((property) => {
      const [name, value] = property.split(/\s*:\s*/);
      style[name] = value;
    });

    return `{${JSON.stringify(style)}}`;
  }

  return `"${value}"`;
}

const editElementAttribute = (target: ts.Node, mutation: SetPropertyMutation<any>) => {

  let element: ts.JsxOpeningElement | ts.JsxSelfClosingElement;

  if (target.kind === ts.SyntaxKind.JsxSelfClosingElement) {
    element = <ts.JsxSelfClosingElement>target;
  } else if (target.kind === ts.SyntaxKind.JsxElement) {
    element = (<ts.JsxElement>target).openingElement;
  }

  let found;
  
  let mutations: StringMutation[] = [];

  const mutateAttrName = alternativeAttrName(mutation.name);
  const mutateAttrValue = mutation.newValue ? transformAttrValue(mutateAttrName, mutation.newValue) : mutation.newValue;

  for (const attribute of element.attributes.properties) {

    // TODO - need to consider spreads
    const attr = attribute as ts.JsxAttribute;
    if (attr.name.text === mutateAttrName) {
      found = true;

      // if the attribute value is undefined, then remove it
      if (mutateAttrValue == null) {
        return createStringMutation(attr.getStart(), attr.getEnd(), ``);
      } else {
        return createStringMutation(attr.initializer.getStart(), attr.initializer.getEnd(), mutateAttrValue);
      }
    }
  }

  if (!found) {
    return createStringMutation(element.tagName.getEnd(), element.tagName.getEnd(), ` ${mutateAttrName}=${mutateAttrValue}`);
  }
};

const isElementMutation = (mutation: Mutation<any>) => {
  return [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT].indexOf(mutation.$type) !== -1;
}

const findTargetASTNode = (root: ts.Node, mutation: Mutation<any>) => {
  let found: ts.Node;

  const content = root.getSourceFile().getText();

  const find = (node: ts.Node)  => {

    const pos = ts.getLineAndCharacterOfPosition(root.getSourceFile(), node.getFullStart());
    const tstart = mutation.target.source.start;

    if (isElementMutation(mutation)) {

      // look for the tag name Identifier
      if (node.kind === ts.SyntaxKind.Identifier && pos.line + 1 === tstart.line && pos.character - 1 === tstart.column) {
        found = node.parent;
        if (found.kind === ts.SyntaxKind.JsxOpeningElement) {
          found = found.parent;
        }
      }
    }

    if (!found) ts.forEachChild(node, find);
  };

  ts.forEachChild(root, find);

  return found;
}