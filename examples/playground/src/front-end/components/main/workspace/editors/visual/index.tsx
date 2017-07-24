import "./index.scss";
import * as React from "react";
import { CanvasComponent } from "./canvas";
import { IsolateComponent } from "front-end/components/isolated";
import { lifecycle, compose, withState } from "recompose";
import { SyntheticBrowser, SyntheticDOMRenderer } from "aerial-synthetic-browser";

export type VisualEditorComponentProps = {
  browser: SyntheticBrowser;
};

export const VisualEditorComponentBase = ({ browser = null }: VisualEditorComponentProps) => browser && <div className="visual-editor-component">
  <IsolateComponent>
    <CanvasComponent browser={browser} />
  </IsolateComponent>
</div>;


 IsolateComponent

export const VisualEditorComponent = VisualEditorComponentBase;