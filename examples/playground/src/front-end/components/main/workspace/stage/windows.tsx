import "./windows.scss";
const VOID_ELEMENTS = require("void-elements");

import * as React from "react";
import { findDOMNode } from "react-dom";
import { weakMemo, Dispatcher, Box, BaseEvent} from "aerial-common2";
import { lifecycle, compose, withState, pure, onlyUpdateForKeys } from "recompose";
import { WindowComponent } from "./window";
import { 
  SyntheticBrowser,
  SyntheticWindow, 
  SyntheticTextNode,
} from "aerial-browser-sandbox";
import { IsolateComponent } from "front-end/components/isolated";

export type WindowsComponentOuterProps = {
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>
};

export type WindowsComponentInnerProps = WindowsComponentOuterProps;

export const WindowsComponentBase = ({ browser = null, dispatch }: WindowsComponentInnerProps) => browser && <div className="preview-component">
  {
    browser.windows.map((window) => <WindowComponent dispatch={dispatch} key={window.$$id} window={window} />)
  }
</div>;

export const WindowsComponent = pure(WindowsComponentBase as any) as typeof WindowsComponentBase;

export * from "./window";