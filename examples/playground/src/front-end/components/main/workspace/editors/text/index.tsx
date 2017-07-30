
import { Dispatcher, BaseEvent, publicObject } from "aerial-common2";
import { textEditorChangedEvent } from "front-end/actions";

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
import { File, getFileExtension } from "front-end/state";

export type TextEditorProps = {
  file: File,
  options?: any,
  dispatch: Dispatcher<any>
};

const MODES = {
  js: "javascript",
  html: "xml",
  css: "css",
}

export const TextEditorComponentBase = ({ options, file, dispatch }: TextEditorProps) => {
  return <div className="text-editor-component">
    <CodeMirror value={(file && file.content) || ""} options={{ 
      mode: file && MODES[getFileExtension(file)]
    }} onChange={value => dispatch(textEditorChangedEvent(file, value))} />
  </div>
}

export const TextEditorComponent = compose(
  pure
)(TextEditorComponentBase as any) as any as typeof TextEditorComponentBase;