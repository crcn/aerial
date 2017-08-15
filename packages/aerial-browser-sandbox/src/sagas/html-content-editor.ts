import parse5 = require("parse5");
import { } from "aerial-sandbox";
import { fork, take } from "redux-saga/effects";
import { UPDATE_VALUE_NODE, findDOMNodeExpression, getHTMLASTNodeLocation } from "../environment";
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
        const targetNode = findMutationTargetExpression(mutation, parseHTML(content)) as any;

        return createStringMutation(targetNode.__location.startOffset, targetNode.__location.startOffset + targetNode.value.trim().length, mutation.newValue);
      });
    }
  });
}

const parseHTML = weakMemo((content) => {
  return parse5.parse(content, { locationInfo: true }) as parse5.AST.Default.Node;
});

const findMutationTargetExpression = (mutation: Mutation<any>, root: parse5.AST.Default.Node) => {
  return findDOMNodeExpression(root, (expression) => {
    const location = getHTMLASTNodeLocation(expression);
    return /*expression.kind === synthetic.source.kind &&*/ expressionPositionEquals(location, mutation.target.source.start)
  });
};