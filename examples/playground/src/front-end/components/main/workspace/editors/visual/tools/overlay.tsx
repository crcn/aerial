import "./overlay.scss";
const cx = require("classnames");
import * as React from "react";
import { Workspace } from "front-end/state";
import { compose, pure, withHandlers } from "recompose";
import { mapValues, values } from "lodash";
import { SyntheticNode, getAllSyntheticDOMNodesAsIdMap, SyntheticWindow } from "aerial-browser-sandbox";
import { getValueById, Dispatcher, Box, wrapEventToDispatch, weakMemo } from "aerial-common2";
import { 
  stageToolOverlayMouseClicked,
  stageToolOverlayMouseMoved 
} from "front-end/actions";

export type VisualToolsComponentProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type WindowOverlayToolsOuterProps = {
  dispatch: Dispatcher<any>;
  window: SyntheticWindow;
  zoom: number;
  hoveringNodes: SyntheticNode[];
};

type NodeOverlayProps = {
  windowId: string;
  box: Box;
  zoom: number;
  hovering: boolean;
  node: SyntheticNode;
  dispatch: Dispatcher<any>;
};

const NodeOverlayBase = ({ windowId, zoom, box, node, dispatch, hovering }: NodeOverlayProps) => {

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
  style={style} />;
}

const NodeOverlay = pure(NodeOverlayBase as any) as typeof NodeOverlayBase;

const WindowOverlayToolsBase = ({ dispatch, window, hoveringNodes, zoom }: WindowOverlayToolsOuterProps) => {

  const style = {
    position: "absolute",
    left: window.box.left,
    top: window.box.top,
    width: window.box.right - window.box.left,
    height: window.box.bottom - window.box.top
  };

  return <div style={style as any}>
    {
      hoveringNodes.map((node) => <NodeOverlay 
        windowId={window.$$id} 
        zoom={zoom} 
        key={node.$$id} 
        node={node} 
        box={window.computedBoxes[node.$$id]} 
        dispatch={dispatch} 
        hovering={true} />)
    }
    <div 
      style={{ width: "100%", height: "100%", position: "absolute" } as any} 
      onMouseMove={wrapEventToDispatch(dispatch, stageToolOverlayMouseMoved.bind(this, window.$$id))} 
      onClick={wrapEventToDispatch(dispatch, stageToolOverlayMouseClicked.bind(this, window.$$id))} 
      onMouseLeave={wrapEventToDispatch(dispatch, stageToolOverlayMouseMoved.bind(this, window.$$id))}
      />
  </div>
};

// for (const nodeId in window.computedBoxes) {
//   const node = allNodes[nodeId];

//   const box  = window.computedBoxes[nodeId];
//   if (node && box) {
//     elements.unshift(
//       <NodeOverlay 
//         windowId={window.$$id} 
//         zoom={workspace.visualEditorSettings.translate.zoom} 
//         key={nodeId} 
//         node={node} 
//         box={box} 
//         dispatch={dispatch} 
//         hovering={workspace.hoveringIds.indexOf(node.$$id) !== -1} 
//         selected={workspace.selectionIds.indexOf(node.$$id) !== -1} />
//     );
//   }
// }
// return elements;

const WindowOverlayTools = pure(WindowOverlayToolsBase as any) as any as typeof WindowOverlayToolsBase;

const getHoveringSyntheticNodes = weakMemo((hoveringIds: string[], window: SyntheticWindow) => {
  const allNodes = getAllSyntheticDOMNodesAsIdMap(window);
  return hoveringIds.map((id) => allNodes[id]).filter((id) => !!id);
});

export const NodeOverlaysToolComponentBase = ({ workspace, dispatch }: VisualToolsComponentProps) => {
  return <div className="visual-tools-layer-component">
    {
      workspace.browser.windows.map((window) => {
        return <WindowOverlayTools key={window.$$id} hoveringNodes={getHoveringSyntheticNodes(workspace.hoveringIds, window)} window={window} dispatch={dispatch} zoom={workspace.visualEditorSettings.translate.zoom} />;
      })
    }
  </div>
}

export const NodeOverlaysToolComponent = pure(NodeOverlaysToolComponentBase as any) as typeof NodeOverlaysToolComponentBase;