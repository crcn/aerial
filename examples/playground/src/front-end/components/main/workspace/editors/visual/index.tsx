import "./index.scss";
import * as React from "react";
import { Dispatcher } from "aerial-common2";
import { Workspace } from "front-end/state";
import { CanvasComponent } from "./canvas";
import { IsolateComponent } from "front-end/components/isolated";
import { VisualToolsComponent } from "./tools";
import { lifecycle, compose, withState, pure } from "recompose";
import { SyntheticBrowser2, SyntheticDOMRenderer } from "aerial-synthetic-browser";

export type VisualEditorComponentProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

export const VisualEditorComponentBase = ({ workspace, dispatch }: VisualEditorComponentProps) => workspace && <div className="visual-editor-component">
  <IsolateComponent inheritCSS>
    <span>
      <CanvasComponent browser={workspace.browser} dispatch={dispatch} />
      <VisualToolsComponent workspace={workspace} dispatch={dispatch} />
    </span>
  </IsolateComponent>
</div>;


 IsolateComponent

export const VisualEditorComponent = pure(VisualEditorComponentBase as any) as typeof VisualEditorComponentBase;

export * from "./canvas";
