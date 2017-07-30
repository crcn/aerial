import { Action, BaseEvent, Point, WrappedEvent } from "aerial-common2";

export const RESIZER_MOVED           = "RESIZER_MOVED";
export const WINDOW_PANE_ROW_CLICKED = "WINDOW_PANE_ROW_CLICKED";
export const PROMPTED_NEW_WINDOW_URL = "PROMPTED_NEW_WINDOW_URL";
export const KEYBOARD_SHORTCUT_ADDED = "KEYBOARD_SHORTCUT_ADDED";
export const DELETE_SHORCUT_PRESSED  = "DELETE_SHORCUT_PRESSED";

export type ResizerMoved = {
  point: Point;
  workspaceId: string;
} & BaseEvent;

export type WindowPaneRowClicked = {
  windowId: string
} & WrappedEvent<React.MouseEvent<any>>;

export type BaseKeyboardEvent<T> = {
  sourceEvent?: T;
} & BaseEvent;

export type PromptedNewWindowUrl = {
  workspaceId: string;
  location: string;
} & BaseEvent;

export type ShortcutEvent = {
  type: string
} & BaseKeyboardEvent<KeyboardEvent>;

export type KeyboardShortcutAdded = {
  keyCombo: string,
  action: Action;
} & BaseEvent;

export type DeleteShortcutPressed = ShortcutEvent;

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

export const keyboardShortcutAdded = (keyCombo: string, action: Action): KeyboardShortcutAdded => ({
  type: KEYBOARD_SHORTCUT_ADDED,
  keyCombo,
  action
});

export const deleteShortcutPressed = (): BaseEvent => ({
  type: DELETE_SHORCUT_PRESSED,
});
