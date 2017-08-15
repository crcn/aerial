import parse5 = require("parse5");
import { } from "aerial-sandbox";
import { fork, take } from "redux-saga/effects";
import { UPDATE_VALUE_NODE, SEnvParentNodeMutationTypes, findDOMNodeExpression, getHTMLASTNodeLocation, SEnvNodeInterface } from "../environment";
import { 
  Mutation, 
  weakMemo,
  takeRequest,
  SetValueMutation, 
  MoveChildMutation, 
  RemoveChildMutation, 
  InsertChildMutation, 
  createStringMutation,
  expressionPositionEquals,
} from "aerial-common2";

import { MutateSourceContentRequest, EDIT_SOURCE_CONTENT, testMutateContentRequest } from "../actions";

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
}

const parseHTML = weakMemo((content) => {
  return parse5.parse(content, { locationInfo: true }) as parse5.AST.Default.Node;
});

const findMutationTargetExpression = (target: SEnvNodeInterface, root: parse5.AST.Default.Node) => {
  return findDOMNodeExpression(root, (expression) => {
    const location = getHTMLASTNodeLocation(expression);
    return /*expression.kind === synthetic.source.kind &&*/ expressionPositionEquals(location, target.source.start)
  });
};