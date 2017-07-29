import { Box, Point } from "../geom";
import { BaseEvent } from "../bus";

export const RESIZED = "resized";
export const MOVED   = "moved";

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