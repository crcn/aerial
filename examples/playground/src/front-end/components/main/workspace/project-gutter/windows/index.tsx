import "./index.scss";
import * as React from "react";
import { Workspace } from "front-end/state";
import { Pane } from "front-end/components/pane";
import { SyntheticWindow } from "aerial-browser-sandbox";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { pure, compose, withHandlers } from "recompose";
import { promptedNewWindowUrl, windowPaneRowClicked } from "front-end/actions";
import { Dispatcher, BaseEvent, wrapEventToDispatch } from "aerial-common2";

const WindowRow = ({ window, dispatch }: { window: SyntheticWindow, dispatch: Dispatcher<any> }) => <div className="m-windows-pane-window-row"  onClick={wrapEventToDispatch(dispatch, windowPaneRowClicked.bind(this, window.$$id))}>
  {window.document && window.document.title || window.location} 
</div>

const WindowsPaneControlsBase = ({ workspace, dispatch, onAddWindow }: { workspace: Workspace, dispatch: Dispatcher<any>, onAddWindow: any }) => <span>
    <i className="icon ion-plus" onClick={onAddWindow}></i>
</span>;

const enhanceControls = compose(
  withHandlers({
    onAddWindow: ({ workspace, dispatch }) => (event: React.MouseEvent<any>) => {
      const location = prompt("Type in a URL");
      if (!location) return;
      dispatch(promptedNewWindowUrl(workspace.$$id, location));
    }
  })
);

const WindowsPaneControls = enhanceControls(WindowsPaneControlsBase as any) as any;


export const WindowsPane = pure((({ workspace, browser, dispatch }: { workspace: Workspace, browser: SyntheticBrowser, dispatch: Dispatcher<any> }) => <Pane title="Windows" className="m-windows-pane" controls={<WindowsPaneControls workspace={workspace} dispatch={dispatch} />}>
  {
    browser.windows.map((window) => <WindowRow key={window.$$id} window={window} dispatch={dispatch} />)
  }
</Pane>) as any);