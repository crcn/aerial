import "./overlay.scss";
const cx = require("classnames");
import * as React from "react";
import { Workspace } from "front-end/state";
import { compose, pure } from "recompose";
import { mapValues, values } from "lodash";
import { SyntheticNode, getAllSyntheticDOMNodesAsIdMap } from "aerial-browser-sandbox";
import { getValueById, Dispatcher, Box, wrapEventToDispatch } from "aerial-common2";
import { stageToolNodeOverlayClicked, stageToolNodeOverlayHoverOver, stageToolNodeOverlayHoverOut } from "front-end/actions";

export type VisualToolsComponentProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type NodeOverlayProps = {
  windowId: string;
  box: Box;
  zoom: number;
  selected: boolean;
  hovering: boolean;
  node: SyntheticNode;
  dispatch: Dispatcher<any>;
};

const NodeOverlayBase = ({ windowId, zoom, box, node, dispatch, hovering, selected }: NodeOverlayProps) => {

  const borderWidth = 2 / zoom;

  const style = {
    left: box.left,
    top: box.top,
    width: box.right - box.left,
    height: box.bottom - box.top,
    boxShadow: `inset 0 0 0 ${borderWidth}px #00B5FF`,
  };

  return <div 
  className={cx("visual-tools-node-overlay", { hovering: hovering })}
  style={style} 
  onClick={wrapEventToDispatch(dispatch, stageToolNodeOverlayClicked.bind(this, windowId, node.$$id))}
  onMouseEnter={wrapEventToDispatch(dispatch, stageToolNodeOverlayHoverOver.bind(this, windowId, node.$$id))}
  onMouseLeave={wrapEventToDispatch(dispatch, stageToolNodeOverlayHoverOut.bind(this, windowId, node.$$id))}>

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
            elements.push(
              <NodeOverlay 
                windowId={window.$$id} 
                zoom={workspace.visualEditorSettings.translate.zoom} 
                key={nodeId} 
                node={node} 
                box={box} 
                dispatch={dispatch} 
                hovering={workspace.hoveringIds.indexOf(node.$$id) !== -1} 
                selected={workspace.selectionIds.indexOf(node.$$id) !== -1} />
            );
          }
        }
        return elements;
      })
    }
  </div>
}

export const NodeOverlaysToolComponent = pure(NodeOverlaysToolComponentBase as any) as typeof NodeOverlaysToolComponentBase;