import "./index.scss";
import * as React from "react";
import { Workspace } from "front-end/state";
import { Pane } from "front-end/components/pane";
import { SyntheticWindow } from "aerial-browser-sandbox";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { pure, compose, withHandlers } from "recompose";
import { promptedNewWindowUrl, windowPaneRowClicked } from "front-end/actions";
import { Dispatcher, BaseEvent, wrapEventToDispatch } from "aerial-common2";

const WindowRow = ({ window, dispatch }: { window: SyntheticWindow, dispatch: Dispatcher<any> }) => <div className="m-windows-pane-window-row"  onClick={wrapEventToDispatch(dispatch, windowPaneRowClicked.bind(this, window.$id))}>
  {window.document && window.document.title || window.location} 
</div>

export type WindowPaneControlsOuterProps = { 
  workspace: Workspace; 
  dispatch: Dispatcher<any>; 
};

export type WindowPaneControlsInnerProps = { 
  onAddWindow: any 
} & WindowPaneControlsOuterProps;

const WindowsPaneControlsBase = ({ workspace, dispatch, onAddWindow }: WindowPaneControlsInnerProps) => <span>
    <i className="icon ion-plus" onClick={onAddWindow}></i>
</span>;

const enhanceControls = compose<WindowPaneControlsInnerProps, WindowPaneControlsOuterProps>(
  withHandlers({
    onAddWindow: ({ workspace, dispatch }) => (event: React.MouseEvent<any>) => {
      const location = prompt("Type in a URL");
      if (!location) return;
      dispatch(promptedNewWindowUrl(workspace.$id, location));
    }
  })
);

const WindowsPaneControls = enhanceControls(WindowsPaneControlsBase);


export type WindowsPaneProps = { 
  workspace: Workspace; 
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>; 
};


export const WindowsPaneBase = ({ workspace, browser, dispatch }: WindowsPaneProps) => <Pane title="Windows" className="m-windows-pane" controls={<WindowsPaneControls workspace={workspace} dispatch={dispatch} />}>
  {
    browser.windows.map((window) => <WindowRow key={window.$id} window={window} dispatch={dispatch} />)
  }
</Pane>;

export const WindowsPane = compose<WindowsPaneProps, WindowsPaneProps>(
  pure
)(WindowsPaneBase);