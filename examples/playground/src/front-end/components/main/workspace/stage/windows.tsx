import "./windows.scss";
const VOID_ELEMENTS = require("void-elements");

import * as React from "react";
import { findDOMNode } from "react-dom";
import { weakMemo, Dispatcher, Box, BaseEvent} from "aerial-common2";
import { lifecycle, compose, withState, pure, onlyUpdateForKeys } from "recompose";
import { Window } from "./window";
import { 
  SyntheticBrowser,
  SyntheticWindow, 
  SyntheticTextNode,
} from "aerial-browser-sandbox";
import { Isolate } from "front-end/components/isolated";

export type WindowsOuterProps = {
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>
};

export type WindowsInnerProps = WindowsOuterProps;

export const WindowsBase = ({ browser = null, dispatch }: WindowsInnerProps) => browser && <div className="preview-component">
  {
    browser.windows.map((window) => <Window dispatch={dispatch} key={window.$$id} window={window} />)
  }
</div>;

export const Windows = pure(WindowsBase as any) as typeof WindowsBase;

export * from "./window";