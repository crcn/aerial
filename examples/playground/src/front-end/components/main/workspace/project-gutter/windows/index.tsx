import "./index.scss";
import * as React from "react";
import { Workspace } from "front-end/state";
import { PaneComponent } from "front-end/components/pane";
import { SyntheticBrowserWindow2 } from "aerial-synthetic-browser";
import { pure, compose, withHandlers } from "recompose";
import { promptedNewWindowUrl, windowPaneRowClicked } from "front-end/actions";
import { Dispatcher, BaseEvent, wrapEventToDispatch } from "aerial-common2";

const WindowRow = ({ window, dispatch }: { window: SyntheticBrowserWindow2, dispatch: Dispatcher<any> }) => <div className="m-windows-pane-window-row"  onClick={wrapEventToDispatch(dispatch, windowPaneRowClicked.bind(this, window.$$id))}>
  {window.title || window.location} 
</div>

const WindowsPaneComponentControlsBase = ({ workspace, dispatch, onAddWindow }: { workspace: Workspace, dispatch: Dispatcher<any>, onAddWindow: any }) => <span>
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

const WindowsPaneComponentControls = enhanceControls(WindowsPaneComponentControlsBase as any) as any;


export const WindowsPaneComponent = pure((({ workspace, dispatch }: { workspace: Workspace, dispatch: Dispatcher<any> }) => workspace.browser && <PaneComponent title="Windows" className="m-windows-pane" controls={<WindowsPaneComponentControls workspace={workspace} dispatch={dispatch} />}>
  {
    workspace.browser.windows.map((window) => <WindowRow key={window.$$id} window={window} dispatch={dispatch} />)
  }
</PaneComponent>) as any);