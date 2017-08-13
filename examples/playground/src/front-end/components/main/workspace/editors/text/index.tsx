
import "./index.scss";
import { textEditorChanged } from "front-end/actions";
import { Dispatcher, BaseEvent, publicObject } from "aerial-common2";

if (typeof window !== "undefined") {
  require("codemirror/lib/codemirror.css");
  require("codemirror/mode/javascript/javascript");
  require("codemirror/mode/xml/xml");
  require("codemirror/mode/css/css");
  require("codemirror/theme/dracula.css");
}

import * as React from "react";
import { FileCacheItem } from "aerial-sandbox2";
import * as CodeMirror from "react-codemirror";
import { getFileExtension } from "front-end/state";
import { pure, lifecycle, compose } from "recompose";

export type TextEditorProps = {
  file: FileCacheItem,
  options?: any,
  dispatch: Dispatcher<any>
};

const MODES = {
  "application/javascript": "javascript",
  "text/html": "xml",
  "text/css": "css",
};

export const TextEditorComponentBase = ({ options, file, dispatch }: TextEditorProps) => {
  return <div className="text-editor-component">
    <CodeMirror value={String((file && file.content) || "")} options={{ 
      theme: "dracula",
      mode: file && MODES[file.contentType]
    }} onChange={value => dispatch(textEditorChanged(file, value))} />
  </div>
}

export const TextEditorComponent = compose(
  pure
)(TextEditorComponentBase as any) as any as typeof TextEditorComponentBase;