import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { ResizerComponent } from "./resizer";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { Dispatcher, mergeBoxes, Boxed, wrapEventToDispatch } from "aerial-common2";
import { Workspace, getBoxedWorkspaceSelection, getSyntheticBrowserBox } from "front-end/state";
import { selectorDoubleClicked } from "front-end/actions";

export type SelectionOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export type SelectionInnerProps = {
} & SelectionOuterProps;

const SelectionBoundsComponent = ({ workspace, browser }: { workspace: Workspace, browser: SyntheticBrowser }) => {
  const selection = getBoxedWorkspaceSelection(browser, workspace);
  const entireBounds = mergeBoxes(...selection.map(value => getSyntheticBrowserBox(browser, value)));
  const style = {};
  const borderWidth = 1 / workspace.visualEditorSettings.translate.zoom;
  const boundsStyle = {
    position: "absolute",
    top: entireBounds.top,
    left: entireBounds.left,
    width: entireBounds.right - entireBounds.left,
    height: entireBounds.bottom - entireBounds.top,
    boxShadow: `inset 0 0 0 ${borderWidth}px #00B5FF`
  };
  return <div style={boundsStyle as any}></div>;
};

export const SelectionStageToolComponentBase = ({ workspace, browser, dispatch }: SelectionInnerProps) => {
  const selection = getBoxedWorkspaceSelection(browser, workspace);
  if (!selection.length || workspace.secondarySelection) return null;

  return <div className="m-stage-selection-tool" onDoubleClick={selection.length === 1 ? wrapEventToDispatch(dispatch, selectorDoubleClicked.bind(this, selection[0])) : null }>
    <SelectionBoundsComponent workspace={workspace} browser={browser} />
    <ResizerComponent workspace={workspace} browser={browser} dispatch={dispatch} />
  </div>;
};

export const SelectionStageToolComponent = pure(SelectionStageToolComponentBase as any) as typeof SelectionStageToolComponentBase;

export * from "./resizer";