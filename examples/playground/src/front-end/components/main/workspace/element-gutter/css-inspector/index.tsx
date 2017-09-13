import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { Pane } from "front-end/components/pane";
import { SyntheticWindow, Workspace, SYNTHETIC_ELEMENT } from "front-end/state";

export type CSSInspectorOuterProps = {
  window: SyntheticWindow;
  workspace: Workspace;
}

const CSSInspectorBase = ({ workspace, window }: CSSInspectorOuterProps) => {
  if (!workspace.selectionRefs.length || workspace.selectionRefs[0][0] !== SYNTHETIC_ELEMENT)  return null;
  return <Pane title="CSS">
    CSS INSPECTOR
  </Pane>;
};

const enhanceeCSSInspector = compose<CSSInspectorOuterProps, CSSInspectorOuterProps>(pure);

export const CSSICSSInspector = enhanceeCSSInspector(CSSInspectorBase);


