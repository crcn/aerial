import {
  Mutation,
  RemoveMutation,
  SetValueMutation,
  PropertyMutation,
  MoveChildMutation,
  SourceStringEditor,
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

  // TODO - possibly move to base editor
  private _sourceEditor: SourceStringEditor;

  constructor(uri, content) {
    super(uri, content);
    this._sourceEditor = new SourceStringEditor(content);
  }

  [RemoveMutation.REMOVE_CHANGE](node: parse5.AST.Default.Element, { target }: RemoveMutation<any>) {
    const index = node.parentNode.childNodes.indexOf(node);
    this._sourceEditor.replace(node.__location.startOffset, node.__location.endOffset, "");
  }

  // compatible with command & value node
  [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT](node: any, { target, newValue }: SetValueMutation<any>) {
    // node.value = node.data = newValue;
    this._sourceEditor.replace(node.__location.startOffset, node.__location.endOffset, newValue);
  }

  [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT](node: parse5.AST.Default.Element, { target, name, newValue, oldName, index }: PropertyMutation<any>) {
    
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
          this._sourceEditor.replace(
            start,
            end,
            ""
          );
          start = end = beforeAttrLocation.startOffset;
        }

        this._sourceEditor.replace(
          start,
          end, 
          newValue ? ` ${name}="${newValue}"` : ``
        );
      }
    }

    if (!found) {
      this._sourceEditor.replace(
        start,
        end, 
        newValue ? ` ${name}="${newValue}"` : ``
      );
    }
  }

  [SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {

    const childExpression = parse5.parseFragment((<SyntheticDOMNode>child).toString(), { locationInfo: true }) as any;

    const beforeChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]) as parse5.AST.Default.Element;

    // no children, so replace the _entire_ element with a new one
    if (!beforeChild) {

      const start = node.__location.startTag.startOffset;
      const end   = node.__location.startTag.endOffset;

      node.childNodes.splice(index, 0, childExpression);

      this._sourceEditor.replace(
        node.__location.startTag.startOffset,
        node.__location.startTag.endOffset,
        formatMarkupExpression(node)
      );
    } else {
      this._sourceEditor.replace(
        beforeChild.__location.startOffset,
        beforeChild.__location.startOffset,
        (<SyntheticDOMNode>child).toString()
      );
    }
  }

  [SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, { target, child, index }: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as parse5.AST.Default.Element;
    this._sourceEditor.replace(
       childNode.__location.startOffset,
       childNode.__location.endOffset,
       ""
    );
    // node.childNodes.splice(node.childNodes.indexOf(childNode), 1);
  }

  [SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT](node: parse5.AST.Default.Element, { target, child, index }: MoveChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const childNode = this.findTargetASTNode(node, child as SyntheticDOMNode) as parse5.AST.Default.Element;

    this._sourceEditor.replace(
      childNode.__location.startOffset,
      childNode.__location.endOffset,
      ""
    );

    const afterChild = (node.childNodes[index] || node.childNodes[node.childNodes.length - 1]) as parse5.AST.Default.Element;

    this._sourceEditor.replace(
      childNode.__location.startOffset,
      childNode.__location.endOffset,
      ""
    );
    
    this._sourceEditor.replace(
      afterChild.__location.endOffset,
      childNode.__location.endOffset,
      this.content.substr(childNode.__location.startOffset, childNode.__location.endOffset - childNode.__location.startOffset)
    );
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

    this._sourceEditor.replace(
      matchingTextNode.__location.startOffset,
      matchingTextNode.__location.endOffset,
      newTextContent
    );
  }

  parseContent(content: string) {
    return parse5.parse(content, { locationInfo: true }) as any;
  }

  getFormattedContent(root: parse5.AST.Default.Node) {
    return this._sourceEditor.getOutput();
  }
}

/*

<div>anchor</div>
<div></div>

*/
