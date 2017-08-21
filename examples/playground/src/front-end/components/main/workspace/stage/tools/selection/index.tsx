import "./index.scss";
import * as React from "react";
import { compose, pure, lifecycle, withHandlers } from "recompose";
import { Resizer } from "./resizer";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { Dispatcher, mergeBounds, Bounded, wrapEventToDispatch } from "aerial-common2";
import { Workspace, getBoundedWorkspaceSelection, getSyntheticBrowserBounds } from "front-end/state";
import { selectorDoubleClicked, stageToolSelectionKeyDown } from "front-end/actions";

export type SelectionOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export type SelectionInnerProps = {
  setSelectionElement(element: HTMLDivElement);
  onKeyDown(event: React.KeyboardEvent<any>);
  onDoubleClick(event: React.MouseEvent<any>);
} & SelectionOuterProps;

const  SelectionBounds = ({ workspace, browser }: { workspace: Workspace, browser: SyntheticBrowser }) => {
  const selection = getBoundedWorkspaceSelection(browser, workspace);
  const entireBounds = mergeBounds(...selection.map(value => getSyntheticBrowserBounds(browser, value)));
  const style = {};
  const borderWidth = 1 / workspace.stage.translate.zoom;
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

export const  SelectionStageToolBase = ({ setSelectionElement, workspace, browser, onKeyDown, dispatch, onDoubleClick }: SelectionInnerProps) => {
  const selection = getBoundedWorkspaceSelection(browser, workspace);      
  if (!selection.length || workspace.secondarySelection) return null;

  return <div ref={setSelectionElement} className="m-stage-selection-tool" tabIndex={-1} onDoubleClick={onDoubleClick} onKeyDown={onKeyDown}>
    <SelectionBounds workspace={workspace} browser={browser} />
    <Resizer workspace={workspace} browser={browser} dispatch={dispatch} />
  </div>;
};

const enhanceSelectionStageTool = compose<SelectionInnerProps, SelectionOuterProps>(
  pure,
  withHandlers({
    setSelectionElement: () => (element: HTMLDivElement) => {
      if (element) {
        element.focus();
      }
    },
    onDoubleClick: ({ dispatch, workspace, browser }: SelectionInnerProps) => (event: React.MouseEvent<any>) => {
      const selection = getBoundedWorkspaceSelection(browser, workspace);      
      if (selection.length === 1) {
        dispatch(selectorDoubleClicked(selection[0], event));
      }
    },
    onKeyDown: ({ workspace, dispatch }) => (event: React.KeyboardEvent<any>) => {
      dispatch(stageToolSelectionKeyDown(workspace.$id, event));
    }
  })
);

export const  SelectionStageTool = enhanceSelectionStageTool(SelectionStageToolBase);

export * from "./resizer";