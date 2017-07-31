import { File } from "front-end/state";
import { TreeNode, Box, Action, BaseEvent, Point, WrappedEvent, publicObject } from "aerial-common2";

export const RESIZER_MOVED               = "RESIZER_MOVED";
export const WINDOW_PANE_ROW_CLICKED     = "WINDOW_PANE_ROW_CLICKED";
export const PROMPTED_NEW_WINDOW_URL     = "PROMPTED_NEW_WINDOW_URL";
export const KEYBOARD_SHORTCUT_ADDED     = "KEYBOARD_SHORTCUT_ADDED";
export const DELETE_SHORCUT_PRESSED      = "DELETE_SHORCUT_PRESSED";
export const TOGGLE_LEFT_GUTTER_PRESSED  = "TOGGLE_LEFT_GUTTER_PRESSED";
export const TOGGLE_RIGHT_GUTTER_PRESSED = "TOGGLE_RIGHT_GUTTER_PRESSED";
export const RESIZER_PATH_MOUSE_MOVED = "RESIZER_PATH_MOUSE_MOVED";
export const TEXT_EDITOR_CHANGED      = "TEXT_EDITOR_CHANGED";
export const CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED = "CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED";
export const TREE_NODE_LABEL_CLICKED = "TREE_NODE_LABE_CLICKED";
export const FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED   = "FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED";
export const FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED";
export const VISUAL_EDITOR_WHEEL = "VISUAL_EDITOR_WHEEL";
export const STAGE_TOOL_WINDOW_TITLE_CLICKED = "STAGE_TOOL_WINDOW_TITLE_CLICKED";
export const STAGE_TOOL_WINDOW_KEY_DOWN = "STAGE_TOOL_WINDOW_KEY_DOWN";
export const STAGE_TOOL_NODE_OVERLAY_CLICKED = "STAGE_TOOL_NODE_OVERLAY_CLICKED";
export const STAGE_TOOL_NODE_OVERLAY_HOVER_OVER = "STAGE_TOOL_NODE_OVERLAY_HOVER_OVER";
export const STAGE_TOOL_NODE_OVERLAY_HOVER_OUT = "STAGE_TOOL_NODE_OVERLAY_HOVER_OUT";
export const DISPLAY_SOURCE_CODE_REQUESTED = "DISPLAY_SOURCE_CODE_REQUESTED";

/**
 * Types
 */

export type VisualEditorWheel = {
  mouseX: number;
  mouseY: number;
  workspaceId: string;
  canvasWidth: number;
  canvasHeight: number;
  type: string;
  metaKey: boolean;
  ctrlKey: boolean;
  deltaX: number;
  deltaY: number;
} & BaseEvent;


export type CanvasElementsComputedPropsChanged = {
  syntheticWindowId: string,
  computedBoxes: {
    [identifier: string]: Box
  },
  computedStyles: {
    [identifier: string]: CSSStyleDeclaration
  }
} & BaseEvent;

export type ResizerMoved = {
  point: Point;
  workspaceId: string;
} & BaseEvent;

export type TreeNodeLabelClickedEvent = {
  node: TreeNode<any>
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

export type ResizerPathMoved = {
  box: Box;
  anchor: Point;
  workspaceId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageWillWindowTitleClicked = {
  windowId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageWillWindowKeyDown = {
  windowId: string;
} & WrappedEvent<React.KeyboardEvent<any>>;

export type StageToolNodeOverlayClicked = {
  workspaceId: string;
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolNodeOverlayHoverOver = {
  workspaceId: string;
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolNodeOverlayHoverOut = {
  workspaceId: string;
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type DeleteShortcutPressed = ShortcutEvent;

export type textEditorChanged = {
  file: File,
  value: string
} & BaseEvent;

/**
 * Factories
 */

export const canvasElementsComputedPropsChanged = (syntheticWindowId: string, computedBoxes: { [identififer: string]: Box }, computedStyles: { [identifier: string]: CSSStyleDeclaration }): CanvasElementsComputedPropsChanged => ({
  syntheticWindowId,
  type: CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED,
  computedBoxes,
  computedStyles
});

export const treeNodeLabelClicked = (node: TreeNode<any>): TreeNodeLabelClickedEvent => ({ type: TREE_NODE_LABEL_CLICKED, node });
export const stageToolWindowTitleClicked = (windowId: string, sourceEvent: React.MouseEvent<any>): StageWillWindowTitleClicked => ({ type: STAGE_TOOL_WINDOW_TITLE_CLICKED, windowId, sourceEvent });
export const stageToolWindowKeyDown = (windowId: string, sourceEvent: React.KeyboardEvent<any>): StageWillWindowKeyDown => ({ type: STAGE_TOOL_WINDOW_KEY_DOWN, windowId, sourceEvent });

export const resizerMoved = (workspaceId: string, point: Point): ResizerMoved => ({
  workspaceId,
  point,
  type: RESIZER_MOVED,
});

export const textEditorChanged = (file: File, value: string): textEditorChanged => ({ type: TEXT_EDITOR_CHANGED, file, value });

export const stageToolNodeOverlayClicked = (workspaceId: string, nodeId: string, sourceEvent: React.MouseEvent<any>): StageToolNodeOverlayClicked => ({
  workspaceId,
  type: STAGE_TOOL_NODE_OVERLAY_CLICKED,
  nodeId,
  sourceEvent
});
export const stageToolNodeOverlayHoverOver = (workspaceId: string, nodeId: string, sourceEvent: React.MouseEvent<any>): StageToolNodeOverlayHoverOver => ({
  workspaceId,
  type: STAGE_TOOL_NODE_OVERLAY_HOVER_OVER,
  nodeId,
  sourceEvent
});
export const stageToolNodeOverlayHoverOut = (workspaceId: string, nodeId: string, sourceEvent: React.MouseEvent<any>): StageToolNodeOverlayHoverOut => ({
  workspaceId,
  type: STAGE_TOOL_NODE_OVERLAY_HOVER_OUT,
  nodeId,
  sourceEvent
});

export const resizerPathMoved = (workspaceId: string, anchor: Point, box: Box, sourceEvent: React.MouseEvent<any>): ResizerPathMoved => ({
  type: RESIZER_PATH_MOUSE_MOVED,
  workspaceId,
  anchor,
  box,
  sourceEvent: {...sourceEvent}
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

export const toggleLeftGutterPressed = (): BaseEvent => ({
  type: TOGGLE_LEFT_GUTTER_PRESSED,
});

export const toggleRightGutterPressed = (): BaseEvent => ({
  type: TOGGLE_RIGHT_GUTTER_PRESSED,
});

export const visualEditorWheel = (workspaceId: string, canvasWidth: number, canvasHeight: number, mousePosition: Point, { metaKey, ctrlKey, deltaX, deltaY, clientX, clientY }: React.WheelEvent<any>): VisualEditorWheel => ({
  workspaceId,
  metaKey,
  mouseX: mousePosition.left,
  mouseY: mousePosition.top,
  canvasWidth,
  canvasHeight,
  ctrlKey,
  deltaX,
  deltaY,
  type: VISUAL_EDITOR_WHEEL,
})

export * from "aerial-synthetic-browser/src/functional/actions";