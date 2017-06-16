import ts =  require("typescript");
import {
  BaseContentEditor,
  ISyntheticObject,
} from "aerial-sandbox";

import {
  DOMNodeType,
  SyntheticDOMNode,
  SyntheticDOMElement,
  SyntheticDOMElementEdit,
  SyntheticDOMContainerEdit,
  SyntheticDOMElementMutationTypes,
  ElementTextContentMimeTypeProvider,
  SyntheticDOMContainerMutationTypes,
} from "aerial-synthetic-browser";
import {
  MoveChildMutation,
  RemoveChildMutation,
  InsertChildMutation,
  PropertyMutation,
} from "aerial-common";

interface ITSReplacement {
  start: number;
  end: number;
  value: string;
}

export class TSEditor extends BaseContentEditor<ts.Node> {

  private _replacements: ITSReplacement[] = [];

  [SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT](target: ts.JsxElement, message: MoveChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const child = this.findTargetASTNode(target, message.child as SyntheticDOMNode);
    this._replacements.push({
      start: child.getStart(),
      end: child.getEnd(),
      value: ""
    });
    const beforeChild = target.children[message.index];
    this._replacements.push({
      start: beforeChild.getStart(),
      end: beforeChild.getStart(),
      value: child.getText()
    });
  }

  [SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT](target: ts.JsxElement, change: RemoveChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {
    const child = this.findTargetASTNode(target, change.child as SyntheticDOMNode);
    this._replacements.push({
      start: child.getStart(),
      end: child.getEnd(),
      value: ""
    });
  }

  [SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT](target: ts.JsxElement | ts.JsxSelfClosingElement, change: InsertChildMutation<SyntheticDOMElement, SyntheticDOMNode>) {

    if (target.kind === ts.SyntaxKind.JsxSelfClosingElement) {
      const jsxElement = <ts.JsxSelfClosingElement>target;
      this._replacements.push({
        start: jsxElement.getEnd() - 2, // />,
        end: jsxElement.getEnd(),
        value: `>${change.child.toString()}</${jsxElement.tagName.getText()}>`
      });

    } else {
      const jsxElement = <ts.JsxElement>target;
      const index = change.index;
      let pos: number;

      if (jsxElement.children.length) {
        pos = jsxElement.children[index >= jsxElement.children.length ? jsxElement.children.length - 1 : index].getEnd();
      } else {
        pos = jsxElement.openingElement.getEnd();
      }

      this._replacements.push({
        start: pos,
        end: pos,
        value: change.child.toString()
      });
    }
  }

  [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT](target: ts.JsxElement | ts.JsxSelfClosingElement, change: PropertyMutation<any>) {

    function alternativeName(name) {
      return {
        class: "className"
      }[name];
    }

    const modify = (target: ts.JsxOpeningElement | ts.JsxSelfClosingElement) => {

      let found;
      target.attributes

      for (const attribute of target.attributes.properties) {

        // TODO - need to consider spreads
        const attr = attribute as ts.JsxAttribute;
        if (attr.name.text === change.name || attr.name.text === alternativeName(change.name)) {
          found = true;

          // if the attribute value is undefined, then remove it
          if (change.newValue == null) {
            this._replacements.push({

              // remove whitespace with -1
              start: attr.getStart(),
              end: attr.getEnd(),
              value: ``
            });
          } else {
            this._replacements.push({
              start: attr.initializer.getStart(),
              end: attr.initializer.getEnd(),
              value: `"${change.newValue}"`
            });
          }
        }
      }

      if (!found) {
        this._replacements.push({
          start: target.tagName.getEnd(),
          end: target.tagName.getEnd(),
          value: ` ${change.name}="${change.newValue}"`
        });
      }
    }

    if (target.kind === ts.SyntaxKind.JsxSelfClosingElement) {
      modify(<ts.JsxSelfClosingElement>target);
    } else if (target.kind === ts.SyntaxKind.JsxElement) {
      modify((<ts.JsxElement>target).openingElement);
    }
  }

  parseContent(content: string) {
    return ts.createSourceFile(this.uri, content, ts.ScriptTarget.ES2016, true);
  }

  findTargetASTNode(root: ts.Node, target: SyntheticDOMNode) {
    let found: ts.Node;

    const content = root.getSourceFile().getText();

    const find = (node: ts.Node)  => {

      const pos = ts.getLineAndCharacterOfPosition(root.getSourceFile(), node.getFullStart());
      const tstart = target.$source.start;

      if (target.nodeType === DOMNodeType.ELEMENT) {

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

  getFormattedContent(root: ts.SourceFile) {

    let text = this.content;
    const replacements = this._replacements.sort((a, b) => {
      return a.start > b.start ? -1 : 1;
    });

    for (const { start, end, value } of replacements) {
      text = text.substr(0, start) + value + text.substr(end);
    }

    return text;
  }
}