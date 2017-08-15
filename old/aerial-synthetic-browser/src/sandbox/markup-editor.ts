import {
  Mutation,
  StringEditor,
  RemoveMutation,
  StringMutation,
  SetValueMutation,
  PropertyMutation,
  MoveChildMutation,
  InsertChildMutation,
  sourcePositionEquals,
} from "aerial-common";

import {
  ISyntheticObject,
  BaseContentEditor,
  ContentEditorFactoryProvider,
} from "aerial-sandbox";

import { diffChars, applyPatches } from "diff";

import parse5 = require("parse5");
import { ElementTextContentMimeTypeProvider } from "../providers";


import {
  SyntheticDOMNode,
  SyntheticDOMElement,
  SyntheticHTMLElement,
  findDOMNodeExpression,
  formatMarkupExpression,
  getHTMLASTNodeLocation,
  SyntheticDOMElementEdit,
  filterDOMNodeExpressions,
  SyntheticDOMValueNodeEdit,
  SyntheticDOMContainerEdit,
  SyntheticDOMElementMutationTypes,
  SyntheticDOMContainerMutationTypes,
  SyntheticDOMValueNodeMutationTypes,
} from "../dom";

interface IReplacement {
  start: number;
  end: number;
  value: string;
}

class MarkupStringMutation<T extends Mutation<ISyntheticObject>> extends StringMutation {
  constructor(start: number, end: number, value: string, readonly node: parse5.AST.Default.Element | parse5.AST.Default.TextNode, readonly source: T) {
    super(start, end, value);
  }
}

// TODO - mutate ast, diff that, then apply sorted
// text transformations
export class MarkupEditor extends BaseContentEditor<parse5.AST.Default.Node> {

  // TODO - possibly move to base editor
  private _sourceMutations: MarkupStringMutation<Mutation<ISyntheticObject>>[];

  constructor(uri, content) {
    super(uri, content);
    this._sourceMutations = [];
  }

  [RemoveMutation.REMOVE_CHANGE](node: parse5.AST.Default.Element, mutation: RemoveMutation<any>) {
    const { target } = mutation;
    const index = node.parentNode.childNodes.indexOf(node);
    this._sourceMutations.push(new MarkupStringMutation(node.__location.startOffset, node.__location.endOffset, "", node, mutation));
  }

  // compatible with command & value node
  [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT](node: any, mutation: SetValueMutation<any>) {
    const { target, newValue } = mutation;
    this._sourceMutations.push(new MarkupStringMutation(node.__location.startOffset, node.__location.endOffset, newValue, node, mutation));
  }

  [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT](node: parse5.AST.Default.Element, mutation: PropertyMutation<any>) {
    const { target, name, newValue, oldName, index } = mutation;
    
    const syntheticElement = <SyntheticHTMLElement>target;

    let start = node.__location.startTag.startOffset + node.tagName.length + 1; // eat < + tagName
    let end   = start;

    let found = false;
    for (let i = node.attrs.length; i--;) {
      const attr = node.attrs[i];
      if (attr.name === name) {
        found = true;
        const attrLocation = node.__location.attrs[attr.name];
        const beforeAttr = node.attrs[index];

        start = attrLocation.startOffset;
        end   = attrLocation.endOffset;
        if (i !== index && beforeAttr) {
          const beforeAttrLocation = node.__location.attrs[beforeAttr.name];
          this._sourceMutations.push(new MarkupStringMutation(
            start,
            end,
            "",
            node,
            mutation
          ));

          start = end = beforeAttrLocation.startOffset;
          node.attrs.splice(i, 1);
          node.attrs.splice(index, 0, attr);
        }

        this._sourceMutations.push(new MarkupStringMutation(
          start,
          end, 
          newValue ? ` ${name}="${newValue}"` : ``,
          node,
          mutation
        ));
      }
    }

    if (!found) {

      const newMutation = new MarkupStringMutation(
        start,
        end, 
        newValue ? ` ${name}="${newValue}"` : ``,
        node,
        mutation
      );
      let i = 0;

      for (i = 0; i < this._sourceMutations.length; i++) {
        const stringMutation = this._sourceMutations[i];
        if (stringMutation.node === node && stringMutation.source.type === SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT) {
          const prevAttrMutation = stringMutation.source as PropertyMutation<any>;
          if (prevAttrMutation.index < index && stringMutation.startIndex === start) {
            break;
          }
        }
      }
      this._sourceMutations.splice(i, 0, newMutation);
      node.attrs.splice(index, 0, { name: name, value: newValue });
    }
  }

  [SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, mutation: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const { target, child, index } = mutation;

    const childExpression = parse5.parseFragment((<SyntheticDOMNode>child).toString(), { locationInfo: true }) as any;

    const beforeChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]) as parse5.AST.Default.Element;

    // no children, so replace the _entire_ element with a new one
    if (!beforeChild) {

      const start = node.__location.startTag.startOffset;
      const end   = node.__location.startTag.endOffset;

      node.childNodes.splice(index, 0, childExpression);

      this._sourceMutations.push(new MarkupStringMutation(
        node.__location.startTag.startOffset,
        node.__location.startTag.endOffset,
        formatMarkupExpression(node),
        node,
        mutation
      ));
    } else {
      this._sourceMutations.push(new MarkupStringMutation(
        beforeChild.__location.startOffset,
        beforeChild.__location.startOffset,
        (<SyntheticDOMNode>child).toString(),
        node,
        mutation
      ));
    }
  }

  [SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, mutation: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const { target, child, index } = mutation;
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as parse5.AST.Default.Element;
    this._sourceMutations.push(new MarkupStringMutation(
       childNode.__location.startOffset,
       childNode.__location.endOffset,
       "",
       node,
       mutation
    ));
  }

  [SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, mutation: MoveChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const { target, child, index } = mutation;
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as parse5.AST.Default.Element;

    this._sourceMutations.push(new MarkupStringMutation(
      childNode.__location.startOffset,
      childNode.__location.endOffset,
      "",
      node,
      mutation
    ));

    const afterChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]) as parse5.AST.Default.Element;

    this._sourceMutations.push(new MarkupStringMutation(
      childNode.__location.startOffset,
      childNode.__location.endOffset,
      "",
      node,
      mutation
    ));
    
    this._sourceMutations.push(new MarkupStringMutation(
      afterChild.__location.endOffset,
      childNode.__location.endOffset,
      this.content.substr(childNode.__location.startOffset, childNode.__location.endOffset - childNode.__location.startOffset),
      node,
      mutation
    ));
  }

  findTargetASTNode(root: parse5.AST.Default.Node, synthetic: SyntheticDOMNode) {
    return findDOMNodeExpression(root, (expression) => {
      const location = getHTMLASTNodeLocation(expression);
      return /*expression.kind === synthetic.source.kind &&*/ sourcePositionEquals(location, synthetic.source.start)
    });
  }

  protected handleUnknownMutation(mutation: Mutation<ISyntheticObject>) {

    const mstart = mutation.target.source.start;

    // for now just support text nodes. However, attributes may need to be implemented here in thre future
    const matchingTextNode = filterDOMNodeExpressions(this._rootASTNode, (expression) => {
      const eloc = getHTMLASTNodeLocation(expression);
      
      // may be new -- ignore if there is no location 
      if (!eloc) return false;

      //  && 
        // (mstart.line < eloc.end.line || (mstart.line === eloc.end.line && mstart.column <= eloc.end.column)
      return (mstart.line > eloc.line || (mstart.line === eloc.line && mstart.column >= eloc.column)); 
    }).pop() as parse5.AST.Default.TextNode;

    if (!matchingTextNode || matchingTextNode.nodeName !== "#text") {
      return super.handleUnknownMutation(mutation);
    }

    if (!matchingTextNode.parentNode) return super.handleUnknownMutation(mutation);

    const element = matchingTextNode.parentNode as parse5.AST.Default.Element;
    const contentMimeType = ElementTextContentMimeTypeProvider.lookup(element, this.kernel);
  
    if (!contentMimeType) return super.handleUnknownMutation(mutation);

    const editorProvider = ContentEditorFactoryProvider.find(contentMimeType, this.kernel);
    if (!editorProvider) {
      return this.logger.error(`Cannot edit ${element.nodeName}:${contentMimeType} element text content.`);
    }

    const nodeLocation = getHTMLASTNodeLocation(matchingTextNode);

    // need to add whitespace before the text node since the editor needs the proper line number in order to apply the
    // mutation. The column number should match.
    const lines = Array.from({ length: nodeLocation.line - 1 }).map(() => "\n").join("");

    const newTextContent = editorProvider.create(this.uri, lines + matchingTextNode.value).applyMutations([mutation]);

    this._sourceMutations.push(new MarkupStringMutation(
      matchingTextNode.__location.startOffset,
      matchingTextNode.__location.endOffset,
      newTextContent,
      matchingTextNode,
      mutation
    ));
  }

  parseContent(content: string) {
    return parse5.parse(content, { locationInfo: true }) as any;
  }

  getFormattedContent(root: parse5.AST.Default.Node) {
    return new StringEditor(this.content).applyMutations(this._sourceMutations);
  }
}

/*

<div>anchor</div>
<div></div>

*/
