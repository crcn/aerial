import "./overlay.scss";
const cx = require("classnames");
import * as React from "react";
import { Workspace } from "front-end/state";
import { compose, pure, withHandlers } from "recompose";
import { mapValues, values } from "lodash";
import { SyntheticNode, SyntheticWindow, SyntheticBrowser } from "aerial-browser-sandbox";
import { Dispatcher, Box, wrapEventToDispatch, weakMemo, StructReference } from "aerial-common2";
import { 
  stageToolOverlayMouseClicked,
  stageToolOverlayMouseMoved,
  stageToolOverlayMouseDoubleClicked,
} from "front-end/actions";

export type VisualToolsComponentProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
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
      onDoubleClick={wrapEventToDispatch(dispatch, stageToolOverlayMouseDoubleClicked.bind(this, window.$$id))} 
      onMouseLeave={wrapEventToDispatch(dispatch, stageToolOverlayMouseMoved.bind(this, window.$$id))}
      />
  </div>
};

const WindowOverlayTools = pure(WindowOverlayToolsBase as any) as any as typeof WindowOverlayToolsBase;

const getHoveringSyntheticNodes = weakMemo((hoveringRefs: StructReference[], { allNodes }: SyntheticWindow) => {
  return hoveringRefs.map(([type, id]) => allNodes[id]).filter((id) => !!id);
});

export const NodeOverlaysToolComponentBase = ({ workspace, browser, dispatch }: VisualToolsComponentProps) => {
  return <div className="visual-tools-layer-component">
    {
      browser.windows.map((window) => {
        return <WindowOverlayTools key={window.$$id} hoveringNodes={getHoveringSyntheticNodes(workspace.hoveringRefs, window)} window={window} dispatch={dispatch} zoom={workspace.stage.translate.zoom} />;
      })
    }
  </div>
}

export const NodeOverlaysToolComponent = pure(NodeOverlaysToolComponentBase as any) as typeof NodeOverlaysToolComponentBase;