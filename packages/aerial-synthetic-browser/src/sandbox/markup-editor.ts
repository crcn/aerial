import {
  Mutation,
  RemoveMutation,
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

// TODO - mutate ast, diff that, then apply sorted
// text transformations
export class MarkupEditor extends BaseContentEditor<parse5.AST.Default.Node> {

  private _replacements: IReplacement[];

  constructor(uri, content) {
    super(uri, content);
    this._replacements = [];
  }

  [RemoveMutation.REMOVE_CHANGE](node: parse5.AST.Default.Element, { target }: RemoveMutation<any>) {
    const index = node.parentNode.childNodes.indexOf(node);

    this._replacements.push({
      start: node.__location.startOffset,
      end: node.__location.endOffset,
      value: ""
    });
  }

  // compatible with command & value node
  [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT](node: any, { target, newValue }: SetValueMutation<any>) {
    // node.value = node.data = newValue;
    this._replacements.push({
      start: node.__location.startOffset,
      end: node.__location.endOffset,
      value: newValue
    })
  }

  [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT](node: parse5.AST.Default.Element, { target, name, newValue, oldName, index }: PropertyMutation<any>) {
    
    const syntheticElement = <SyntheticHTMLElement>target;

    let start = node.__location.startTag.startOffset + node.tagName.length + 1; // eat <
    let end   = start;

    let found;
    for (let i = node.attrs.length; i--;) {
      const attr = node.attrs[i];
      if (attr.name === name) {
        found = true;
        const attrLocation = node.__location.attrs[attr.name];
        start = attrLocation.startOffset - 1;
        end   = attrLocation.endOffset;
        if (i !== index) {
          const swapAttr = node.attrs[index];
          // this._replacements.push({

          // });
        }
        break;
      }
    }

    this._replacements.push({
      start: start,
      end: end,
      value: newValue && ` ${name}="${newValue}"`
    });
  }

  [SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {

    const childExpression = parse5.parseFragment((<SyntheticDOMNode>child).toString(), { locationInfo: true }) as any;

    const beforeChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]) as parse5.AST.Default.Element;

    if (!beforeChild) {

      const start = node.__location.startTag.startOffset;
      const end   = node.__location.startTag.endOffset;

      node.childNodes.splice(index, 0, childExpression);

      this._replacements.push({
        start: node.__location.startTag.startOffset,
        end: node.__location.startTag.endOffset,
        value: formatMarkupExpression(node)
      });
    } else {
      this._replacements.push({
        start: beforeChild.__location.startOffset,
        end: beforeChild.__location.startOffset,
        value: (<SyntheticDOMNode>child).toString(),
      });
    }
  }

  [SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as parse5.AST.Default.Element;
    this._replacements.push({
      start: childNode.__location.startOffset,
      end: childNode.__location.endOffset,
      value: ""
    });
    // node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
  }

  [SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, { target, child, index }: MoveChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as parse5.AST.Default.Element;

    this._replacements.push({
      start: childNode.__location.startOffset,
      end: childNode.__location.endOffset,
      value: ""
    });

    const afterChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]) as parse5.AST.Default.Element;

    this._replacements.push({
      start: afterChild.__location.endOffset,
      end: childNode.__location.endOffset,
      value: this.content.substr(childNode.__location.startOffset, childNode.__location.endOffset - childNode.__location.startOffset)
    });
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

    this._replacements.push({
      start: matchingTextNode.__location.startOffset,
      end: matchingTextNode.__location.endOffset,
      value: newTextContent
    });
  }

  parseContent(content: string) {
    return parse5.parse(content, { locationInfo: true }) as any;
  }

  getFormattedContent(root: parse5.AST.Default.Node) {

    let result = this.content;
    const used = [];

    const variants = [];
  
    console.log(result, 'RES');;
    for (const {start, value = "", end } of this._replacements.reverse()) {
      result = result.substr(0, start) + value + result.substr(end);
      console.log(result);
    }
    
    // // ends first
    // this._replacements.sort((a, b) => {
    //   return a.start > b.start ? -1 : 1;
    // }).forEach(({ start, value, end }) => {
    //   variants.push(result.substr(0, start) + value + result.substr(end));
    // });

    // let newResult = variants.shift();

    // // TODO - parse tokens here and diff that insteadh
    // for (const variant of variants) {
    //   console.log(diffChars(newResult, variant));

    //   newResult = diffChars(newResult, variant)
    //   .filter(change => !change.removed)
    //   .map(change => change.value)
    //   .join("");
    // }

    // console.log(variants, newResult);

    return result;
  }
}

/*

<div>anchor</div>
<div></div>

*/
