import "./index.scss";

import * as React from "react";

export type TextEditorProps = {

};

export const TextEditorComponentBase = (props: TextEditorProps) => <div className="text-editor-component">
  text editor
</div>;

export const TextEditorComponent = TextEditorComponentBase;