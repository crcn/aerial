import "./edit-text.scss";
import * as React from "react";
import { Workspace } from "front-end/state";
import { compose, pure, lifecycle } from "recompose";
import { Dispatcher, getBoxSize ,wrapEventToDispatch } from "aerial-common2";
import { stageToolEditTextChanged, stageToolEditTextBlur } from "front-end/actions";
import { 
  SyntheticNode, 
  SyntheticWindow,
  isSyntheticDOMNode,
  getSyntheticNodeById, 
  getSyntheticNodeWindow,
  getAllSyntheticDOMNodes, 
  getSyntheticNodeTextContent,
} from "aerial-browser-sandbox";

export type EditTextToolInnerProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
}

export const EditTextToolComponentBase = ({ workspace, dispatch }: EditTextToolInnerProps) => {
  if (!workspace.secondarySelection) return null;
  const zoom = workspace.visualEditorSettings.translate.zoom;
  const selectedNode: SyntheticNode = workspace.selectionIds.map(id => getSyntheticNodeById(workspace, id)).shift();
  if (!isSyntheticDOMNode(selectedNode)) return null;
  const nodeWindow: SyntheticWindow = getSyntheticNodeWindow(workspace, selectedNode.$$id);
  const box = nodeWindow.computedBoxes[selectedNode.$$id];
  const computedStyle = (nodeWindow.computedStyles[selectedNode.$$id] || {}) as CSSStyleDeclaration;
  if (!box) return null;

  const { width, height } = getBoxSize(box);

  const style = {
    fontSize: computedStyle.fontSize,
    color: computedStyle.color,
    position: "absolute",
    left: nodeWindow.box.left + box.left,
    top: nodeWindow.box.top + box.top,
    width: width,
    height: height
  };

  const textStyle = {
    fontSize: computedStyle.fontSize,
    // color: computedStyle.color,
    fontFamily: computedStyle.fontFamily,
    lineHeight: computedStyle.lineHeight,
    letterSpacing: computedStyle.letterSpacing,
    textAlign: computedStyle.textAlign,
    padding: computedStyle.padding,
    background: "white"
    // webkitTextFillColor: `transparent`
  };

  return <div style={style as any}>
    <textarea 
    style={{ width: "100%", height: "100%", padding: 0, ...textStyle }} 
    defaultValue={getSyntheticNodeTextContent(selectedNode)}
    onChange={wrapEventToDispatch(dispatch, stageToolEditTextChanged.bind(this, selectedNode.$$id))}
    onBlur={wrapEventToDispatch(dispatch, stageToolEditTextBlur.bind(this, selectedNode.$$id))}
    ></textarea>
  </div>;
}

const enhanceEditTextToolComponent = compose<EditTextToolInnerProps, EditTextToolInnerProps>(
  pure
);

export const EditTextToolComponent = enhanceEditTextToolComponent(EditTextToolComponentBase);
