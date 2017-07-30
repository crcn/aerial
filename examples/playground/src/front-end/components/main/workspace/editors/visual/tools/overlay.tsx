import "./overlay.scss";
import * as React from "react";
import { Workspace } from "front-end/state";
import { getValueById, Dispatcher, Box, wrapEventToDispatch } from "aerial-common2";
import { compose, pure } from "recompose";
import { mapValues, values } from "lodash";
import { stageToolNodeOverlayClicked } from "front-end/actions";
import { SyntheticDOMNode2, getAllSyntheticDOMNodesAsIdMap } from "aerial-synthetic-browser";

export type VisualToolsComponentProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type NodeOverlayProps = {
  workspace: Workspace;
  box: Box,
  node: SyntheticDOMNode2;
  dispatch: Dispatcher<any>;
};

const NodeOverlayBase = ({ workspace, box, node, dispatch }: NodeOverlayProps) => {
  const style = {
    left: box.left,
    top: box.top,
    width: box.right - box.left,
    height: box.bottom - box.top
  };

  return <div className="visual-tools-node-overlay" style={style} onClick={wrapEventToDispatch(dispatch, stageToolNodeOverlayClicked.bind(this, workspace.$$id, node.$$id))}>

  </div>;
}

const NodeOverlay = pure(NodeOverlayBase as any) as typeof NodeOverlayBase;

export const NodeOverlaysToolComponentBase = ({ workspace, dispatch }: VisualToolsComponentProps) => {
  const allNodes = getAllSyntheticDOMNodesAsIdMap(workspace);
  return <div className="visual-tools-layer-component">
    {
      workspace.browser.windows.map((window) => {
        const elements = [];
        for (const nodeId in window.computedBoxes) {
          const node = allNodes[nodeId];
          const box  = window.computedBoxes[nodeId];
          if (node && box) {
            elements.push(<NodeOverlay workspace={workspace} key={nodeId} node={node} box={box} dispatch={dispatch} />);
          }
        }
        return elements;
      })
    }
  </div>
}

export const NodeOverlaysToolComponent = pure(NodeOverlaysToolComponentBase as any) as typeof NodeOverlaysToolComponentBase;