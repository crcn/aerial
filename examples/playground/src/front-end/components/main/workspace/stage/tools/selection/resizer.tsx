import "./resizer.scss";
import React =  require("react");
import { debounce } from "lodash";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { pure, compose, withHandlers } from "recompose";
import { Workspace, getBoundedWorkspaceSelection, getStageZoom, getWorkspaceSelectionBounds, getStageTranslate } from "front-end/state";
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

  const bounds = getWorkspaceSelectionBounds(browser, workspace);
  const zoom = getStageZoom(workspace.stage);

  // offset stroke
  const resizerStyle = {
    position : "absolute",
    left     : bounds.left,
    top      : bounds.top,
    width    : bounds.right - bounds.left,
    height   : bounds.bottom - bounds.top,
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

  return <div className="m-resizer-component" tabIndex={-1}>
    <div
      className="m-resizer-component--selection"
      style={resizerStyle as any}
      onMouseDown={onMouseDown}
    >
      <Path
        zoom={zoom}
        points={points}
        workspace={workspace}
        bounds={bounds}
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
      
      const translate = getStageTranslate(workspace.stage);
      const bounds = getWorkspaceSelectionBounds(browser, workspace);
      const translateLeft = translate.left;
      const translateTop  = translate.top;
      const onStartDrag = (event) => {
        dispatch(resizerMouseDown(workspace.$id, event));
      };
      const onDrag = (event2, { delta }) => {
        dispatch(resizerMoved(workspace.$id, {
          left: bounds.left + delta.x / translate.zoom,
          top: bounds.top + delta.y / translate.zoom,
        }));
      };

      // debounce stopped moving so that it beats the stage click event
      // which checks for moving or resizing state.
      const onStopDrag = debounce(() => {
        dispatch(resizerStoppedMoving(workspace.$id, null));
      }, 0);

      startDOMDrag(event, onStartDrag, onDrag, onStopDrag);
    }
  })
);

export const Resizer = enhanceResizer(ResizerBase);
export * from "./path";