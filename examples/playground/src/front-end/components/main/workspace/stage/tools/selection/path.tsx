import "./path.scss";
import * as  React from "react";
import { compose, pure, withHandlers } from "recompose";
import { getWorkspaceById, Workspace } from "front-end/state";
import { resizerPathMoved } from "front-end/actions";
import { Dispatcher, startDOMDrag, Point, BaseEvent, WrappedEvent, Bounds } from "aerial-common2";

export const RESIZER_PATH_MOUSE_MOVED = "RESIZER_PATH_MOUSE_MOVED";


export type PathOuterProps = {
  points: Point[];
  zoom: number;
  pointRadius: number;
  strokeWidth: number;
  workspace: Workspace;
  showPoints?: boolean;
  box: Bounds;
  dispatch: Dispatcher<any>;
}

export type PathInnerProps = {
  onPointClick: (point: Point, event: React.MouseEvent<any>) => {};
} & PathOuterProps;

export const PathBase = ({ box , points, zoom, pointRadius, strokeWidth, showPoints = true, onPointClick }: PathInnerProps) => {

  let d = "";

  // calculate the size of the box
  points.forEach(function (point, i) {
    d += (i === 0 ? "M" : "L") + point.left + " " + point.top;
  });

  d += "Z";

  const width = box.right - box.left;
  const height = box.bottom - box.top;
  const cr = pointRadius;
  const crz = cr / zoom;
  const cw = cr * 2;
  const cwz = cw / zoom;
  const w = Math.ceil(width + Math.max(cw, cwz));
  const h = Math.ceil(height + Math.max(cw, cwz));
  const p = 100;

  return <svg width={w} height={h} viewBox={[0, 0, w, h].join(" ")} className="resizer-path">
    <path d={d} strokeWidth={strokeWidth} stroke="transparent" fill="transparent" />
    {
      showPoints !== false ? points.map((path, key) =>
        <rect
          onMouseDown={(event) => onPointClick(path, event)} 
          className={`point-circle-${(path.top * 100)}-${path.left * 100}`}
          strokeWidth={0}
          stroke="black"
          fill="transparent"
          width={cwz}
          height={cwz}
          x={path.left * width}
          y={path.top * height}
          rx={0}
          ry={0}
          key={key}
        />
      ) : void 0
    }
  </svg>;
};

const enhancePath = compose<PathInnerProps, PathOuterProps>(
  pure,
  withHandlers({
    onPointClick: ({ box, dispatch, zoom, workspace }: PathOuterProps) => (point: Point, event: React.MouseEvent<any>) => {
      event.stopPropagation();
      const sourceEvent = {...event};
      startDOMDrag(event, (event2, info) => {
        const delta = {
          left: info.delta.x / zoom,
          top: info.delta.y / zoom
        };
        
        dispatch(resizerPathMoved(workspace.$$id, point, {
          left: point.left === 0 ? box.left + delta.left : box.left,
          top: point.top === 0 ? box.top + delta.top : box.top,
          right: point.left === 1 ? box.right + delta.left : box.right,
          bottom: point.top === 1 ? box.bottom + delta.top : box.bottom,
        }, sourceEvent));
      }, () => {
      });
    }
  })
)

export const Path = enhancePath(PathBase as any);
