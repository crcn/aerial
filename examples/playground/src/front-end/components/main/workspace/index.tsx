import "./index.scss";
import * as React from "react";
import { TextEditorComponent, VisualEditorComponent } from "./editors";


export const WorkspaceComponentBase = (props: any) => {
  return <div className="workspace-component">
    <TextEditorComponent />
    <VisualEditorComponent />
  </div>
}

export const WorkspaceComponent = WorkspaceComponentBase;