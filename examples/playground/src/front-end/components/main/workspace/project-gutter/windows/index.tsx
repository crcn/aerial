import "./index.scss";
import * as React from "react";
import { pure } from "recompose";
import { Workspace } from "front-end/state";
import { SyntheticBrowserWindow2 } from "aerial-synthetic-browser";
import { PaneComponent } from "front-end/components/pane";

const WindowRow = ({ window }: { window: SyntheticBrowserWindow2 }) => <div className="m-windows-pane-window-row">
  {window.location} 
  <div className="m-windows-pane-window-row-dom">
  </div>
</div>

export const WindowsPaneComponent = pure((({ workspace }: { workspace: Workspace }) => workspace.browser && <PaneComponent title="Windows" className="m-windows-pane">
  {
    workspace.browser.windows.map((window) => <WindowRow key={window.$$id} window={window} />)
  }
</PaneComponent>) as any);