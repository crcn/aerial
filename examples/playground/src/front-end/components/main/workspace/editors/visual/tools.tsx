import "./tools.scss";
import * as React from "react";
import { Workspace } from "front-end/state";
import { getValueById, Dispatcher, Box } from "aerial-common2";
import { compose, pure } from "recompose";
import { mapValues, values } from "lodash";
import { SyntheticDOMNode2, getAllSyntheticDOMNodesAsIdMap } from "aerial-synthetic-browser";

export type VisualToolsComponentProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type ElementOverlayProps = {
  box: Box,
  element: SyntheticDOMNode2
};

const ElementOverlayBase = ({ box, element }: ElementOverlayProps) => {
  const style = {
    left: box.left,
    top: box.top,
    width: box.right - box.left,
    height: box.bottom - box.top
  };

  return <div className="visual-tools-element-overlay" style={style}>
    
  </div>
}

const ElementOverlay = pure(ElementOverlayBase as any) as typeof ElementOverlayBase;

export const VisualToolsComponentBase = ({ workspace }: VisualToolsComponentProps) => {
  const allNodes = getAllSyntheticDOMNodesAsIdMap(workspace);
  return <div className="visual-tools-layer-component">
    {
      workspace.browser.windows.map((window) => {
        const elements = [];
        for (const nodeId in window.computedBoxes) {
          const node = allNodes[nodeId];
          const box  = window.computedBoxes[nodeId];
          if (node && box) {
            elements.push(<ElementOverlay key={nodeId} element={node} box={box} />);
          }
        }
        return elements;
      })
    }
  </div>
}

export const VisualToolsComponent = pure(VisualToolsComponentBase as any) as typeof VisualToolsComponentBase;