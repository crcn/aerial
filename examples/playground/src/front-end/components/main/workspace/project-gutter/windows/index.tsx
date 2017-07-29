import "./index.scss";
import * as React from "react";
import { pure } from "recompose";
import { readAll } from "mesh";
import { Workspace } from "front-end/state";
import { PaneComponent } from "front-end/components/pane";
import { SyntheticBrowserWindow2 } from "aerial-synthetic-browser";
import { Dispatcher, BaseEvent, wrapEventToDispatch } from "aerial-common2";

export const WINDOW_PANE_ROW_CLICKED = "WINDOW_PANE_ROW_CLICKED";
export type WindowPaneRowClicked = {
  windowId: string
} & BaseEvent;
export const windowPaneRowClicked = (windowId: string): WindowPaneRowClicked => ({
  windowId,
  type: WINDOW_PANE_ROW_CLICKED
});

const WindowRow = ({ window, dispatch }: { window: SyntheticBrowserWindow2, dispatch: Dispatcher<any> }) => <div className="m-windows-pane-window-row"  onClick={wrapEventToDispatch(dispatch, windowPaneRowClicked.bind(this, window.$$id))}>
  {window.location} 
</div>

const WindowsPaneComponentControls = ({ dispatch }: { dispatch: Dispatcher<any> }) => <span>
    <i className="icon ion-plus"></i>
</span>;

export const WindowsPaneComponent = pure((({ workspace, dispatch }: { workspace: Workspace, dispatch: Dispatcher<any> }) => workspace.browser && <PaneComponent title="Windows" className="m-windows-pane" controls={<WindowsPaneComponentControls dispatch={dispatch} />}>
  {
    workspace.browser.windows.map((window) => <WindowRow key={window.$$id} window={window} dispatch={dispatch} />)
  }
</PaneComponent>) as any);