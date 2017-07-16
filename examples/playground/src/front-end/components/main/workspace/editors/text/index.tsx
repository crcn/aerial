import "./index.scss";
import "codemirror/lib/codemirror.css";

import * as React from "react";
import * as CodeMirror from "react-codemirror";


export type TextEditorProps = {
  options?: any
};

export const TextEditorComponentBase = ({options}: TextEditorProps) => <div className="text-editor-component">
  <CodeMirror value={"test"} options={{lineNumbers: true }} />
</div>;

export const TextEditorComponent = TextEditorComponentBase;