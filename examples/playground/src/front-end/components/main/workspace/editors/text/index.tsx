import "./index.scss";
import "codemirror/lib/codemirror.css";

import * as React from "react";
import * as CodeMirror from "react-codemirror";

import { readAll } from "mesh";
import { Dispatcher, Event } from "aerial-common2";

export type TextEditorProps = {
  options?: any,
  value: string,
  dispatch: Dispatcher<any>
};

export const TEXT_EDITOR_CHANGED = "TEXT_EDITOR_CHANGED";
export type TextEditorChangedEvent = {
  value: string
} & Event;
export const textEditorChangedEvent = (value: string): TextEditorChangedEvent => ({ type: TEXT_EDITOR_CHANGED, value });

export const TextEditorComponentBase = ({ options, value, dispatch }: TextEditorProps) => <div className="text-editor-component">
  <CodeMirror value={value} options={{lineNumbers: true }} onChange={value => dispatch && readAll(dispatch(textEditorChangedEvent(value)))} />
</div>;

export const TextEditorComponent = TextEditorComponentBase;