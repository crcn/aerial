import "./edit-text.scss";
import * as React from "react";
import {findDOMNode} from "react-dom";
import { Workspace } from "front-end/state";
import { compose, pure, lifecycle, withState } from "recompose";
import { Dispatcher, getBoxSize ,wrapEventToDispatch } from "aerial-common2";
import { stageToolEditTextChanged, stageToolEditTextBlur } from "front-end/actions";
import { 
  SyntheticNode, 
  SyntheticWindow,
  SyntheticBrowser,
  isSyntheticDOMNode,
  getSyntheticNodeById, 
  getSyntheticNodeWindow,
  getSyntheticNodeTextContent,
} from "aerial-browser-sandbox";

export type EditTextToolOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export type EditTextToolInnerProps = {
  textarea: HTMLTextAreaElement;
  setTextarea: (v: any) => any;
} & EditTextToolOuterProps;

export const EditTextToolBase = ({ workspace, browser, dispatch, setTextarea }: EditTextToolInnerProps) => {
  if (!workspace.secondarySelection) return null;
  const zoom = workspace.stage.translate.zoom;
  const selectedNode: SyntheticNode = workspace.selectionRefs.map(([type, id]) => getSyntheticNodeById(browser, id)).shift();
  if (!isSyntheticDOMNode(selectedNode)) return null;
  const nodeWindow: SyntheticWindow = getSyntheticNodeWindow(browser, selectedNode.$$id);
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
    height: height,
    zIndex: 99999999
  };

  const textStyle = {
    fontSize: computedStyle.fontSize,
    // color: computedStyle.color,
    fontFamily: computedStyle.fontFamily,
    lineHeight: computedStyle.lineHeight,
    letterSpacing: computedStyle.letterSpacing,
    textAlign: computedStyle.textAlign,
    padding: computedStyle.padding,
    background: "white",
    border: "none",
    // webkitTextFillColor: `transparent`
  };

  return <div style={style as any}>
    <textarea 
     ref={setTextarea}
    style={{ width: "100%", height: "100%", padding: 0, ...textStyle }} 
    defaultValue={getSyntheticNodeTextContent(selectedNode)}
    onChange={wrapEventToDispatch(dispatch, stageToolEditTextChanged.bind(this, selectedNode.$$id))}
    onBlur={wrapEventToDispatch(dispatch, stageToolEditTextBlur.bind(this, selectedNode.$$id))}
    ></textarea>
  </div>;
}

const enhanceEditTextTool = compose<EditTextToolInnerProps, EditTextToolOuterProps>(
  pure,
  withState("textarea", "setTextarea", null),
  lifecycle<EditTextToolInnerProps, any>({
    componentWillUpdate({ textarea }) {
      if (textarea && this.props.textarea !== textarea) {
        textarea.select();
      }
    }
  })
);

export const EditTextTool = enhanceEditTextTool(EditTextToolBase);
