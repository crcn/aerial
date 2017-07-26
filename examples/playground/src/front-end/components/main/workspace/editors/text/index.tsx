
import { Dispatcher, BaseEvent, publicObject } from "aerial-common2";

import "./index.scss";

if (typeof window !== "undefined") {
  require("codemirror/lib/codemirror.css");
  require("codemirror/mode/javascript/javascript");
  require("codemirror/mode/xml/xml");
  require("codemirror/mode/css/css");
}

import { pure, lifecycle, compose } from "recompose";
import * as React from "react";
import * as CodeMirror from "react-codemirror";

import { readAll } from "mesh";
import { File, getFileExtension } from "front-end/state";

export type TextEditorProps = {
  file: File,
  options?: any,
  dispatch: Dispatcher<any>
};

export const TEXT_EDITOR_CHANGED = "TEXT_EDITOR_CHANGED";
export type TextEditorChangedEvent = {
  file: File,
  value: string
} & BaseEvent;

export const textEditorChangedEvent = publicObject((file: File, value: string): TextEditorChangedEvent => ({ type: TEXT_EDITOR_CHANGED, file, value }));

const MODES = {
  js: "javascript",
  html: "xml",
  css: "css",
}

export const TextEditorComponentBase = ({ options, file, dispatch }: TextEditorProps) => {
  return <div className="text-editor-component">
    <CodeMirror value={(file && file.content) || ""} options={{ 
      lineNumbers: true,
      mode: file && MODES[getFileExtension(file)]
    }} onChange={value => readAll(dispatch(textEditorChangedEvent(file, value)))} />
  </div>
}

export const TextEditorComponent = compose(
  pure
)(TextEditorComponentBase as any) as any as typeof TextEditorComponentBase;