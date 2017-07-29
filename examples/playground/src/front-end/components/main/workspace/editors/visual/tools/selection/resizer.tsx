import "./resizer.scss";
import React =  require("react");
import { Workspace, getBoxedWorkspaceSelection } from "front-end/state";
import { startDOMDrag, Dispatcher, mergeBoxes } from "aerial-common2";
import { PathComponent } from "./path";

export type PathComponentProps = {
  dispatch: Dispatcher<any>;
  workspace: Workspace;
}

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 4;


export const ResizerComponent = ({ workspace, dispatch }: PathComponentProps) => {

  const box = mergeBoxes(...getBoxedWorkspaceSelection(workspace).map(boxed => boxed.box));
  const zoom = workspace.visualEditorSettings.translate.zoom;

  // offset stroke
  const resizerStyle = {
    position : "absolute",
    left     : box.left,
    top      : box.top,
    width    : box.right - box.left,
    height   : box.bottom - box.top,
    transform: `translate(-${POINT_RADIUS / zoom}px, -${POINT_RADIUS / zoom}px)`,
    transformOrigin: "top left"
  };

  const points = [
    { left: 0, top: 0 },
    { left: .5, top: 0 },
    { left: 1, top: 0 },
    { left: 1, top: .5 },
    { left: 1, top: 1 },
    { left: .5, top: 1 },
    { left: 0, top: 1 },
  ];

  return <div className="m-resizer-component">
    <div
      className="m-resizer-component--selection"
      style={resizerStyle as any}
    >
      <PathComponent
        zoom={zoom}
        points={points}
        workspace={workspace}
        width={resizerStyle.width}
        height={resizerStyle.height}
        strokeWidth={POINT_STROKE_WIDTH}
        dispatch={dispatch}
        pointRadius={POINT_RADIUS}
      />
    </div>
  </div>
}

export default ResizerComponent;
export * from "./path";