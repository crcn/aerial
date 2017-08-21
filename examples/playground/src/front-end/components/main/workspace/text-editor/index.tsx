
import "./index.scss";
import { textEditorChanged } from "front-end/actions";
import { Dispatcher, BaseEvent, publicObject, ExpressionPosition } from "aerial-common2";

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
import { pure, lifecycle, compose, withState } from "recompose";

export type TextEditorProps = {
  file: FileCacheItem,
  options?: any,
  cursorPosition: ExpressionPosition;
  dispatch: Dispatcher<any>
};

export type TextEditorInnerProps = {
  codeMirror: any;
  setCodeMirror(value: any);
} & TextEditorProps;

const MODES = {
  "application/javascript": "javascript",
  "text/html": "xml",
  "text/css": "css",
};

export const TextEditorBase = ({ options, file, dispatch, setCodeMirror }: TextEditorInnerProps) => {
  return <div className="text-editor-component">
    <CodeMirror ref={setCodeMirror} options={{ 
      theme: "dracula",
      mode: file && MODES[file.contentType]
    }} onChange={value => dispatch(textEditorChanged(file, value))} />
  </div>
}

export const TextEditor = compose<TextEditorInnerProps, TextEditorProps>(
  pure,
  withState("codeMirror", "setCodeMirror", null),
  lifecycle({
    componentWillUpdate({ codeMirror, cursorPosition, file }: TextEditorInnerProps) {
      if (codeMirror) {
        if (cursorPosition !== (this.props as any).cursorPosition) {
          setImmediate(() => {
            codeMirror.focus();
            codeMirror.codeMirror.setCursor({ line: cursorPosition.line - 1, ch: cursorPosition.column - 1 });
          });
        }

        if (file !== this["_file"] && codeMirror.codeMirror.getValue() !== String(file.content)) {
          this["_file"] = file;
          const scrollInfo = codeMirror.codeMirror.getScrollInfo();
          codeMirror.codeMirror.setValue(String(file.content));
          codeMirror.codeMirror.scrollTo(scrollInfo.left, scrollInfo.top);
        }
      }
    }
  })
)(TextEditorBase);