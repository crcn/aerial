import parse5 = require("parse5");
import { } from "aerial-sandbox";
import { fork, take } from "redux-saga/effects";
import { UPDATE_VALUE_NODE, SEnvParentNodeMutationTypes, findDOMNodeExpression, getHTMLASTNodeLocation, SEnvNodeInterface, SyntheticDOMElementMutationTypes, SEnvElementInterface } from "../environment";
import { 
  Mutation, 
  weakMemo,
  takeRequest,
  SetPropertyMutation,
  SetValueMutation, 
  MoveChildMutation, 
  RemoveChildMutation, 
  InsertChildMutation, 
  createStringMutation,
  expressionPositionEquals,
} from "aerial-common2";

import { MutateSourceContentRequest, EDIT_SOURCE_CONTENT, testMutateContentRequest } from "../actions";

const maintinWhitespaceTrimmings = (oldContent: string, newContent: string) => {
  const wsParts = oldContent.match(/(^[\s\r\n\t]*|[\s\r\n\t]*$)/g);
  return wsParts[0] + newContent.trim() + wsParts[1];
};

export function* htmlContentEditorSaga(contentType: string = "text/html") {

  yield fork(function* handleSetValueNode() {
    while(true) {
      yield takeRequest(testMutateContentRequest(contentType, UPDATE_VALUE_NODE), ({ mutation, content }: MutateSourceContentRequest<SetValueMutation<any>>) => {  
        const targetNode = findMutationTargetExpression(mutation.target, parseHTML(content)) as any;

        return createStringMutation(targetNode.__location.startOffset, targetNode.__location.startOffset + targetNode.value.trim().length, mutation.newValue);
      });
    }
  });

  yield fork(function* handleRemoveNode() {
    while(true) {
      yield takeRequest(testMutateContentRequest(contentType, SEnvParentNodeMutationTypes.REMOVE_CHILD_NODE_EDIT), ({ mutation, content }: MutateSourceContentRequest<RemoveChildMutation<any, any>>) => {  
        const targetNode = findMutationTargetExpression(mutation.child, parseHTML(content)) as any;
        return createStringMutation(targetNode.__location.startOffset, targetNode.__location.endOffset, "");
      });
    }
  });

  yield fork(function* handleSetTextContent() {
    while(true) {
      yield takeRequest(testMutateContentRequest(contentType, SyntheticDOMElementMutationTypes.SET_TEXT_CONTENT), ({ mutation, content }: MutateSourceContentRequest<SetPropertyMutation<any>>) => {  
        const targetNode = findMutationTargetExpression(mutation.target, parseHTML(content)) as parse5.AST.Default.Element;
        const start = targetNode.__location.startTag.endOffset;
        const end = targetNode.__location.endTag ? targetNode.__location.endTag.startOffset : targetNode.__location.endOffset;
        const oldContent = content.substr(start, end - start);
        return createStringMutation(start, end, maintinWhitespaceTrimmings(oldContent, mutation.newValue));
      });
    }
  });

  yield fork(function* handleSetAttributes() {
    while(true) {
      yield takeRequest(testMutateContentRequest(contentType, SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT), ({ mutation, content }: MutateSourceContentRequest<SetPropertyMutation<any>>) => {  

        const node = findMutationTargetExpression(mutation.target, parseHTML(content)) as any;
        const { target, name, newValue, oldName, index } = mutation;
    
        const syntheticElement = <SEnvElementInterface>target;

        let start = node.__location.startTag.startOffset + node.tagName.length + 1; // eat < + tagName
        let end   = start;

        let found = false;
        const mutations = []
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
              mutations.push(createStringMutation(
                start,
                end,
                ""
              ));

              start = end = beforeAttrLocation.startOffset;
              node.attrs.splice(i, 1);
              node.attrs.splice(index, 0, attr);
            }

            mutations.push(createStringMutation(
              start,
              end, 
              newValue ? `${name}="${newValue}"` : ``
            ));
          }
        }

        if (!found) {

          const newMutation = createStringMutation(
            start,
            end, 
            newValue ? ` ${name}="${newValue}"` : ``
          );
          // let i = 0;

          // for (i = 0; i < this._sourceMutations.length; i++) {
          //   const stringMutation = this._sourceMutations[i];
          //   if (stringMutation.node === node && stringMutation.source.type === SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT) {
          //     const prevAttrMutation = stringMutation.source as PropertyMutation<any>;
          //     if (prevAttrMutation.index < index && stringMutation.startIndex === start) {
          //       break;
          //     }
          //   }
          // }

          return newMutation;
        }

        return mutations;
      });
    }
  });
}

const parseHTML = weakMemo((content) => {
  return parse5.parse(content, { locationInfo: true }) as parse5.AST.Default.Node;
});

const findMutationTargetExpression = (target: SEnvNodeInterface, root: parse5.AST.Default.Node) => {
  return findDOMNodeExpression(root, (expression: parse5.AST.Default.Node) => {
    const location = getHTMLASTNodeLocation(expression);
    return expression.nodeName === target.nodeName.toLowerCase() && expressionPositionEquals(location, target.source.start)
  });
};