import "./path.scss";
import * as  React from "react";
import { readAll } from "mesh";
import { compose, pure, withHandlers } from "recompose";
import { getWorkspaceById, Workspace } from "front-end/state";
import { Dispatcher, startDOMDrag, Point, BaseEvent, WrappedEvent, updateStructProperty } from "aerial-common2";

export const RESIZER_PATH_MOUSE_DOWN  = "RESIZER_PATH_MOUSE_DOWN";
export const RESIZER_PATH_MOUSE_MOVED = "RESIZER_PATH_MOUSE_MOVED";
export const RESIZER_PATH_MOUSE_UP    = "RESIZER_PATH_MOUSE_UP";

export type ResizerPathEvent = {
  point: Point;
  workspaceId: string;
} & WrappedEvent;

export type ResizerPathMoved = {
  delta: Point;
} & ResizerPathEvent;

export const resizerPathEvent = (type: string, workspaceId: string, point: Point, sourceEvent: any): ResizerPathEvent => ({
  type,
  workspaceId,
  point,
  sourceEvent
});


export const resizerPathMoved = (workspaceId: string, point: Point, delta: Point, sourceEvent: any): ResizerPathMoved => ({
  type: RESIZER_PATH_MOUSE_MOVED,
  workspaceId,
  point,
  delta,
  sourceEvent
});

export const resizerPathReducer = (state: any, event: BaseEvent) => {
  switch(event.type) {
    case RESIZER_PATH_MOUSE_DOWN: {

    }
    case RESIZER_PATH_MOUSE_MOVED: {
      console.log("MOVED");
      break;
    }
    case RESIZER_PATH_MOUSE_UP: {
      console.log("FUP");
      break;
    }
  }
  return state;
}

export type PathComponentOuterProps = {
  points: Point[];
  zoom: number;
  pointRadius: number;
  strokeWidth: number;
  workspace: Workspace;
  showPoints?: boolean;
  width: number;
  height: number;
  dispatch: Dispatcher<any>;
}

export type PathComponentInnerProps = {
  onPointClick: (point: Point, event: React.MouseEvent<any>) => {};
} & PathComponentOuterProps;

export const PathComponentBase = ({  width, height, points, zoom, pointRadius, strokeWidth, showPoints = true, onPointClick }: PathComponentInnerProps) => {

  let d = "";

  // calculate the size of the box
  points.forEach(function (point, i) {
    d += (i === 0 ? "M" : "L") + point.left + " " + point.top;
  });

  d += "Z";

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

const enhancePathComponent = compose<PathComponentInnerProps, PathComponentOuterProps>(
  pure,
  withHandlers({
    onPointClick: ({ dispatch, zoom, workspace }: PathComponentOuterProps) => (point: Point, event: React.MouseEvent<any>) => {
      readAll(dispatch(resizerPathEvent(RESIZER_PATH_MOUSE_DOWN, workspace.$$id, point, event)));
      startDOMDrag(event, (event2, info) => {
        const delta = {
          left: info.delta.x / zoom,
          top: info.delta.y / zoom
        };
        readAll(dispatch(resizerPathMoved(workspace.$$id, point, delta, event)));
      }, () => {
        readAll(dispatch(resizerPathEvent(RESIZER_PATH_MOUSE_UP, workspace.$$id, point, event)));
      });
    }
  })
)

export const PathComponent = enhancePathComponent(PathComponentBase as any);
