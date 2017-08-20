import { Bounds, Point } from "../geom";
import { BaseEvent } from "../bus";

export const RESIZED = "RESIZED";
export const MOVED   = "MOVED";
export const STOPPED_MOVING   = "STOPPED_MOVING";
export const REMOVED = "REMOVED";

export type Resized = {
  itemId: string;
  itemType: string;
  bounds: Bounds;
} & BaseEvent;

export type Moved = {
  itemId: string;
  itemType: string;
  point: Point;
} & BaseEvent;

export type Removed = {
  itemId: string;
  itemType: string;
} & BaseEvent;

export const resized = (itemId: string, itemType: string, bounds: Bounds): Resized => ({
  itemId,
  itemType,
  bounds,
  type: RESIZED
});

export const moved = (itemId: string, itemType: string, point: Point): Moved => ({
  itemId,
  itemType,
  point,
  type: MOVED
});

export const stoppedMoving = (itemId: string, itemType: string): Moved => ({
  itemId,
  itemType,
  point: null,
  type: STOPPED_MOVING
});

export const removed = (itemId: string, itemType: string): Removed => ({
  itemId,
  itemType,
  type: REMOVED
});