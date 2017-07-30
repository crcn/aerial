import { Box, Point } from "../geom";
import { BaseEvent } from "../bus";

export const RESIZED = "resized";
export const MOVED   = "moved";
export const REMOVED = "removed";

export type Resized = {
  itemId: string;
  itemType: string;
  box: Box;
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

export const resized = (itemId: string, itemType: string, box: Box): Resized => ({
  itemId,
  itemType,
  box,
  type: RESIZED
});

export const moved = (itemId: string, itemType: string, point: Point): Moved => ({
  itemId,
  itemType,
  point,
  type: MOVED
});

export const removed = (itemId: string, itemType: string): Removed => ({
  itemId,
  itemType,
  type: REMOVED
});