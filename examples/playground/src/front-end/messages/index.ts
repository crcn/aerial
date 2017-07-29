import { BaseEvent, Point } from "aerial-common2";

export const RESIZER_MOVED = "RESIZER_MOVED";
export type ResizerMoved = {
  point: Point;
  workspaceId: string;
} & BaseEvent;

export const resizerMoved = (workspaceId: string, point: Point): ResizerMoved => ({
  workspaceId,
  point,
  type: RESIZER_MOVED,
});