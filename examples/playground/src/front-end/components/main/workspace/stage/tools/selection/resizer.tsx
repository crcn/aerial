import "./resizer.scss";
import React =  require("react");
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { pure, compose, withHandlers } from "recompose";
import { Workspace, getBoundedWorkspaceSelection, getWorkspaceSelectionBounds } from "front-end/state";
import { resizerMoved, resizerStoppedMoving, resizerMouseDown } from "front-end/actions";
import { startDOMDrag, Dispatcher, mergeBounds, moveBounds } from "aerial-common2";
import { Path } from "./path";

export type ResizerOuterProps = {
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
  workspace: Workspace;
}

export type ResizerInnerProps = {
  onMouseDown: (event: React.MouseEvent<any>) => any;
} & ResizerOuterProps;

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 4;


export const ResizerBase = ({ workspace, browser, dispatch, onMouseDown }: ResizerInnerProps) => {

  const box = getWorkspaceSelectionBounds(browser, workspace);
  const zoom = workspace.stage.translate.zoom;

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
    { left: 0, top: 0.5 },
  ];

  return <div className="m-resizer-component">
    <div
      className="m-resizer-component--selection"
      style={resizerStyle as any}
      onMouseDown={onMouseDown}
    >
      <Path
        zoom={zoom}
        points={points}
        workspace={workspace}
        box={box}
        strokeWidth={POINT_STROKE_WIDTH}
        dispatch={dispatch}
        pointRadius={POINT_RADIUS}
      />
    </div>
  </div>
}

const enhanceResizer = compose<ResizerInnerProps, ResizerOuterProps>(
  pure,
  withHandlers({
    onMouseDown: ({ dispatch, workspace, browser }: ResizerOuterProps) => (event: React.MouseEvent<any>) => {
      dispatch(resizerMouseDown(workspace.$$id, event));
      const { translate } = workspace.stage;
      const box = getWorkspaceSelectionBounds(browser, workspace);
      const translateLeft = translate.left;
      const translateTop  = translate.top;
      startDOMDrag(event, (event2, { delta }) => {
        dispatch(resizerMoved(workspace.$$id, {
          left: box.left + delta.x / translate.zoom,
          top: box.top + delta.y / translate.zoom,
        }));
      }, () => {
        dispatch(resizerStoppedMoving(workspace.$$id, null));
      });
    }
  })
);

export const Resizer = enhanceResizer(ResizerBase);
export * from "./path";