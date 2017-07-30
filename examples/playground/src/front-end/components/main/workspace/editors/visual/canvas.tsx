import "./canvas.scss";
const VOID_ELEMENTS = require("void-elements");

import * as React from "react";
import { findDOMNode } from "react-dom";
import { weakMemo, Dispatcher, Box, BaseEvent} from "aerial-common2";
import { lifecycle, compose, withState, pure, onlyUpdateForKeys } from "recompose";
import { WindowComponent } from "./window";
import { 
  DOMNodeType,
  SyntheticBrowser2, 
  SyntheticDOMNode2, 
  SyntheticDOMRenderer,
  SyntheticDOMElement2,
  SyntheticDOMTextNode2,
  SyntheticBrowserWindow2, 
} from "aerial-synthetic-browser";
import { IsolateComponent } from "front-end/components/isolated";

export type CanvasComponentOuterProps = {
  browser: SyntheticBrowser2;
  dispatch: Dispatcher<any>
};

export type CanvasComponentInnerProps = CanvasComponentOuterProps;

export const CanvasComponentBase = ({ browser = null, dispatch }: CanvasComponentInnerProps) => browser && <div className="visual-canvas-component">
  {
    browser.windows.map((window) => <WindowComponent dispatch={dispatch} key={window.$$id} window={window} />)
  }
</div>;

export const CanvasComponent = pure(CanvasComponentBase as any) as typeof CanvasComponentBase;

export * from "./window";