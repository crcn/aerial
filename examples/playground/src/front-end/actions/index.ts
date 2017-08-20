import { FileCacheItem } from "aerial-sandbox2";
import { TreeNode, Bounds, Action, BaseEvent, Point, WrappedEvent, publicObject, Struct } from "aerial-common2";

export const RESIZER_MOVED               = "RESIZER_MOVED";
export const RESIZER_STOPPED_MOVING      = "RESIZER_STOPPED_MOVING";
export const RESIZER_MOUSE_DOWN          = "RESIZER_MOUSE_DOWN";
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
export const STAGE_TOOL_WINDOW_BACKGROUND_CLICKED = "STAGE_TOOL_WINDOW_BACKGROUND_CLICKED";
export const DISPLAY_SOURCE_CODE_REQUESTED = "DISPLAY_SOURCE_CODE_REQUESTED";
export const STAGE_TOOL_OVERLAY_MOUSE_MOVED = "STAGE_TOOL_OVERLAY_MOUSE_MOVED";
export const STAGE_TOOL_OVERLAY_MOUSE_LEAVE = "STAGE_TOOL_OVERLAY_MOUSE_LEAVE";
export const STAGE_TOOL_OVERLAY_MOUSE_PAN_START = "STAGE_TOOL_OVERLAY_MOUSE_PAN_START";
export const STAGE_TOOL_OVERLAY_MOUSE_PANNING = "STAGE_TOOL_OVERLAY_MOUSE_PANNING";
export const STAGE_TOOL_OVERLAY_MOUSE_PAN_END = "STAGE_TOOL_OVERLAY_MOUSE_PAN_END";
export const WORKSPACE_DELETION_SELECTED = "WORKSPACE_DELETION_SELECTED";
export const STAGE_TOOL_OVERLAY_MOUSE_CLICKED = "STAGE_TOOL_OVERLAY_MOUSE_CLICKED";
export const STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED = "STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED";
export const SELECTOR_DOUBLE_CLICKED = "SELECTOR_DOUBLE_CLICKED";
export const STAGE_TOOL_EDIT_TEXT_CHANGED = "STAGE_TOOL_EDIT_TEXT_CHANGED";
export const STAGE_TOOL_EDIT_TEXT_BLUR = "STAGE_TOOL_EDIT_TEXT_BLUR";
export const STAGE_MOUNTED = "STAGE_MOUNTED";

/**
 * Types
 */

export type StageWheel = {
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

export type StageMounted = {
  element: HTMLDivElement;
} & BaseEvent;

export type CanvasElementsComputedPropsChanged = {
  syntheticWindowId: string,
  allComputedBounds: {
    [identifier: string]: Bounds
  },
  allComputedStyles: {
    [identifier: string]: CSSStyleDeclaration
  }
} & BaseEvent;

export type ResizerMoved = {
  point: Point;
  workspaceId: string;
} & BaseEvent;

export type ResizerMouseDown = {
  workspaceId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type TreeNodeLabelClicked = {
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
  box: Bounds;
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
  windowId: string;
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolNodeOverlayHoverOver = {
  windowId: string;
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolEditTextChanged = {
  nodeId: string;
} & WrappedEvent<React.ChangeEvent<any>>;

export type StageToolEditTextBlur = {
  nodeId: string;
} & WrappedEvent<React.FocusEvent<any>>;

export type StageToolNodeOverlayHoverOut = {
  windowId: string;
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolOverlayMouseMoved = {
  windowId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolOverlayMousePanStart = {
  windowId: string;
} & BaseEvent;

export type StageToolOverlayMousePanning = {
  windowId: string;
  deltaY: number;
  velocityY: number;
  center: Point;
} & BaseEvent;

export type StageToolOverlayMousePanEnd = {
  windowId: string;
} & BaseEvent;

export type StageToolOverlayClicked = {
  windowId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type SelectorDoubleClicked = {
  item: Struct;
} & WrappedEvent<React.MouseEvent<any>>;

export type WorkspaceSelectionDeleted = {
  workspaceId: string;
} & BaseEvent;

export type DeleteShortcutPressed = ShortcutEvent;

export type textEditorChanged = {
  file: FileCacheItem,
  value: string
} & BaseEvent;

/**
 * Factories
 */

export const canvasElementsComputedPropsChanged = (syntheticWindowId: string, allComputedBounds: { [identififer: string]: Bounds }, allComputedStyles: { [identifier: string]: CSSStyleDeclaration }): CanvasElementsComputedPropsChanged => ({
  syntheticWindowId,
  type: CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED,
  allComputedBounds,
  allComputedStyles
});

export const treeNodeLabelClicked = (node: TreeNode<any>): TreeNodeLabelClicked => ({ type: TREE_NODE_LABEL_CLICKED, node });
export const stageToolWindowTitleClicked = (windowId: string, sourceEvent: React.MouseEvent<any>): StageWillWindowTitleClicked => ({ type: STAGE_TOOL_WINDOW_TITLE_CLICKED, windowId, sourceEvent });
export const stageToolWindowKeyDown = (windowId: string, sourceEvent: React.KeyboardEvent<any>): StageWillWindowKeyDown => ({ type: STAGE_TOOL_WINDOW_KEY_DOWN, windowId, sourceEvent });

export const stageToolWindowBackgroundClicked = (sourceEvent: React.KeyboardEvent<any>): WrappedEvent<React.KeyboardEvent<any>> => ({ type: STAGE_TOOL_WINDOW_BACKGROUND_CLICKED, sourceEvent });

export const resizerMoved = (workspaceId: string, point: Point): ResizerMoved => ({
  workspaceId,
  point,
  type: RESIZER_MOVED,
});

export const resizerStoppedMoving = (workspaceId: string, point: Point): ResizerMoved => ({
  workspaceId,
  point,
  type: RESIZER_STOPPED_MOVING,
});

export const resizerMouseDown = (workspaceId: string, sourceEvent: React.MouseEvent<any>): ResizerMouseDown => ({
  workspaceId,
  sourceEvent,
  type: RESIZER_MOUSE_DOWN,
});

export const textEditorChanged = (file: FileCacheItem, value: string): textEditorChanged => ({ type: TEXT_EDITOR_CHANGED, file, value });

export const stageToolOverlayMouseMoved = (windowId: string, sourceEvent: React.MouseEvent<any>): StageToolOverlayMouseMoved => ({
  windowId,
  type: STAGE_TOOL_OVERLAY_MOUSE_MOVED,
  sourceEvent
});


export const stageToolOverlayMouseLeave = (windowId: string, sourceEvent: React.MouseEvent<any>): StageToolOverlayMouseMoved => ({
  windowId,
  type: STAGE_TOOL_OVERLAY_MOUSE_LEAVE,
  sourceEvent
});

export const stageToolOverlayMousePanStart = (windowId: string): StageToolOverlayMousePanStart => ({
  windowId,
  type: STAGE_TOOL_OVERLAY_MOUSE_PAN_START,
});

export const stageToolOverlayMousePanning = (windowId: string, center: Point, deltaY: number, velocityY: number): StageToolOverlayMousePanning => ({
  windowId,
  center,
  deltaY,
  velocityY,
  type: STAGE_TOOL_OVERLAY_MOUSE_PANNING,
});

export const stageToolOverlayMousePanEnd = (windowId: string): StageToolOverlayMousePanEnd => ({
  windowId,
  type: STAGE_TOOL_OVERLAY_MOUSE_PAN_END,
});

export const stageToolOverlayMouseClicked = (windowId: string, sourceEvent: React.MouseEvent<any>): StageToolOverlayClicked => ({
  windowId,
  type: STAGE_TOOL_OVERLAY_MOUSE_CLICKED,
  sourceEvent
});

export const stageToolOverlayMouseDoubleClicked = (windowId: string, sourceEvent: React.MouseEvent<any>): StageToolOverlayClicked => ({
  windowId,
  type: STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
  sourceEvent
});

export const selectorDoubleClicked = (item: Struct, sourceEvent: React.MouseEvent<any>): SelectorDoubleClicked => ({
  item,
  type: SELECTOR_DOUBLE_CLICKED,
  sourceEvent
});

export const resizerPathMoved = (workspaceId: string, anchor: Point, box: Bounds, sourceEvent: React.MouseEvent<any>): ResizerPathMoved => ({
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

export const workspaceSelectionDeleted = (workspaceId: string): WorkspaceSelectionDeleted => ({
  workspaceId,
  type: WORKSPACE_DELETION_SELECTED
});

export const promptedNewWindowUrl = (workspaceId: string, location: string): PromptedNewWindowUrl => ({
  location,
  workspaceId,
  type: PROMPTED_NEW_WINDOW_URL
});

export const stageToolEditTextChanged = (nodeId: string, sourceEvent: React.ChangeEvent<any>): StageToolEditTextChanged => ({
  type: STAGE_TOOL_EDIT_TEXT_CHANGED,
  nodeId,
  sourceEvent
});

export const stageToolEditTextBlur = (nodeId: string, sourceEvent: React.FocusEvent<any>): StageToolEditTextBlur => ({
  nodeId,
  type: STAGE_TOOL_EDIT_TEXT_BLUR,
  sourceEvent
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

export const stageWheel = (workspaceId: string, canvasWidth: number, canvasHeight: number, mousePosition: Point, { metaKey, ctrlKey, deltaX, deltaY, clientX, clientY }: React.WheelEvent<any>): StageWheel => ({
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
});

export const stageContainerMounted = (element: HTMLDivElement): StageMounted => ({
  element,
  type: STAGE_MOUNTED,
})

