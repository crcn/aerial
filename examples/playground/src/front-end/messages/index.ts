import { BaseEvent, Point, WrappedEvent } from "aerial-common2";

export const RESIZER_MOVED           = "RESIZER_MOVED";
export const WINDOW_PANE_ROW_CLICKED = "WINDOW_PANE_ROW_CLICKED";
export const PROMPTED_NEW_WINDOW_URL = "PROMPTED_NEW_WINDOW_URL";

export type ResizerMoved = {
  point: Point;
  workspaceId: string;
} & BaseEvent;

export type WindowPaneRowClicked = {
  windowId: string
} & WrappedEvent<React.MouseEvent<any>>;

export type PromptedNewWindowUrl = {
  workspaceId: string;
  location: string;
} & BaseEvent;

export const resizerMoved = (workspaceId: string, point: Point): ResizerMoved => ({
  workspaceId,
  point,
  type: RESIZER_MOVED,
});

export const windowPaneRowClicked = (windowId: string, sourceEvent: React.MouseEvent<any>): WindowPaneRowClicked => ({
  windowId,
  sourceEvent,
  type: WINDOW_PANE_ROW_CLICKED
});

export const promptedNewWindowUrl = (workspaceId: string, location: string): PromptedNewWindowUrl => ({
  location,
  workspaceId,
  type: PROMPTED_NEW_WINDOW_URL
});
