import "./path.scss";
import * as  React from "react";
import { compose, pure, withHandlers } from "recompose";
import { getWorkspaceById, Workspace } from "front-end/state";
import { resizerPathMoved, resizerPathStoppedMoving } from "front-end/actions";
import { Dispatcher, startDOMDrag, Point, BaseEvent, WrappedEvent, Bounds } from "aerial-common2";


export type PathOuterProps = {
  points: Point[];
  zoom: number;
  pointRadius: number;
  strokeWidth: number;
  workspace: Workspace;
  showPoints?: boolean;
  bounds: Bounds;
  dispatch: Dispatcher<any>;
}

export type PathInnerProps = {
  onPointClick: (point: Point, event: React.MouseEvent<any>) => {};
} & PathOuterProps;

export const PathBase = ({ bounds , points, zoom, pointRadius, strokeWidth, showPoints = true, onPointClick }: PathInnerProps) => {

  let d = "";

  // calculate the size of the bounds
  points.forEach(function (point, i) {
    d += (i === 0 ? "M" : "L") + point.left + " " + point.top;
  });

  d += "Z";

  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
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
    onPointClick: ({ bounds, dispatch, zoom, workspace }: PathOuterProps) => (point: Point, event: React.MouseEvent<any>) => {
      event.stopPropagation();
      const sourceEvent = {...event};
      startDOMDrag(event, (() => {}), (event2, info) => {
        const delta = {
          left: info.delta.x / zoom,
          top: info.delta.y / zoom
        };
        
        
        dispatch(resizerPathMoved(workspace.$id, point, bounds, {
          left: point.left === 0 ? bounds.left + delta.left : bounds.left,
          top: point.top === 0 ? bounds.top + delta.top : bounds.top,
          right: point.left === 1 ? bounds.right + delta.left : bounds.right,
          bottom: point.top === 1 ? bounds.bottom + delta.top : bounds.bottom,
        }, event2));
      }, (event) => {
        dispatch(resizerPathStoppedMoving(workspace.$id, event));
      });
    }
  })
)

export const Path = enhancePath(PathBase as any);
