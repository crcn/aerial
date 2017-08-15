import {
  Box,
  Boxed,
  Action,
  Struct,
  shiftBox,
  zoomBox,
  TreeNode,
  weakMemo,
  Translate,
  mergeBoxes,
  getPathById,
  filterBoxed,
  getValueById,
  updateStruct,
  getSmallestBox,
  ImmutableArray, 
  getValueByPath,
  ImmutableObject,
  findParentObject,
  ExpressionPosition,
  pointIntersectsBox,
  createStructFactory,
  BaseApplicationState,
  updateStructProperty,
  createImmutableArray,
  createImmutableObject,
  ImmutableArrayIdentity,
  ImmutableObjectIdentity,
  createImmutableStructFactory,
} from "aerial-common2";
import { createFileCache, FileCache, FileCacheItem } from "aerial-sandbox2";

import { StageToolOverlayMouseMoved, StageToolOverlayClicked } from "../actions";
import { Shortcut, ShortcutServiceState, createKeyboardShortcut } from "./shortcuts";
import { toggleLeftGutterPressed, toggleRightGutterPressed, deleteShortcutPressed } from "front-end/actions";

import {
  SyntheticBrowser,
  getSyntheticNodeById,
  getSyntheticWindow,
  getSyntheticNodeWindow,
  getSyntheticBrowserBox,
} from "aerial-browser-sandbox";

import {
  uniq,
  difference,
} from "lodash";

import { Kernel } from "aerial-common";


/**
 * Types
 */

export const FILE              = "FILE";
export const DIRECTORY         = "DIRECTORY";
export const WORKSPACE         = "WORKSPACE";
export const APPLICATION_STATE = "APPLICATION_STATE";

export type VisualEditorSettings = {
  backgroundColor?: string;
  translate: Translate;
  cursor?: string;
  showLeftGutter?: boolean;
  showRightGutter?: boolean;
}

export type Workspace = {
  selectionIds: string[];
  hoveringIds: string[];
  selectedFileId?: string;
  browser: SyntheticBrowser;
  visualEditorSettings: VisualEditorSettings;
  textCursorPosition: ExpressionPosition;
  secondarySelection?: boolean;
} & Struct;

export type ApplicationState = {
  kernel: Kernel;
  workspaces: Workspace[];
  selectedWorkspaceId?: string;
  element: HTMLElement;
  apiHost: string;
  fileCache: FileCache
} & BaseApplicationState &  ShortcutServiceState & Struct;

/**
 * Utilities
 */

export const getFileExtension = (file: FileCacheItem) => file.sourceUri.split(".").pop();

export const getSelectedWorkspaceFile = (state: ApplicationState, workspace: Workspace): FileCacheItem => {
  return workspace.selectedFileId && getValueById(state.fileCache, workspace.selectedFileId);
}

export const getSyntheticWindowWorkspace = (root: any, windowId: string): Workspace => {
  const path = getPathById(root, windowId);
  let current = root;
  for (const segment of path) {
    current = current[segment];
    if (current.$$type === WORKSPACE) {
      return current as any as Workspace;
    }
  }
}

export const addWorkspaceSelection = (root: any, workspaceId: string, ...selectionIds: string[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...workspace.selectionIds, ...selectionIds);
};

export const removeWorkspaceSelection = (root: any, workspaceId: string, ...selectionIds: string[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...workspace.selectionIds.filter((id) => selectionIds.indexOf(id) === -1));
}

export const toggleWorkspaceSelection = (root: any, workspaceId: string, ...selectionIds: string[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...difference(selectionIds, workspace.selectionIds));
};

export const clearWorkspaceSelection = (root: any, workspaceId: string) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateStruct(root, workspace, {
    selectionIds: [],
    secondarySelection: false
  });
};

export const setWorkspaceSelection = (root: any, workspaceId: string, ...selectionIds: string[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateStructProperty(root, workspace, "selectionIds", uniq([...selectionIds]));
};

export const addWorkspaceHovering = (root: any, workspaceId: string, ...hoveringIds: string[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateStructProperty(root, workspace, "hoveringIds", uniq([...hoveringIds]));
};

export const removeWorkspaceHovering = (root: any, workspaceId: string, ...hoveringIds: string[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateStructProperty(root, workspace, "hoveringIds", difference(workspace.hoveringIds, hoveringIds));
};

export const getSyntheticNodeWorkspace = weakMemo((root: any, nodeId: string): Workspace => findParentObject(root, nodeId, parent => parent.$$type === WORKSPACE));

export const getBoxedWorkspaceSelection = weakMemo((workspace: Workspace): Array<Boxed & Struct> => workspace.selectionIds.map(id => getValueById(workspace, id)).filter(item => getSyntheticBrowserBox(workspace, item)));
export const getWorkspaceSelectionBox = weakMemo((workspace: Workspace) => mergeBoxes(...getBoxedWorkspaceSelection(workspace).map(boxed => getSyntheticBrowserBox(workspace, boxed))));

export const getWorkspaceById = (state: ApplicationState, id: string): Workspace => getValueById(state, id);
export const getSelectedWorkspace = (state: ApplicationState) => state.selectedWorkspaceId && getWorkspaceById(state, state.selectedWorkspaceId);
export const getSelectedWorkspacePath = (state: ApplicationState) => getPathById(state, state.selectedWorkspaceId);

/**
 * Factories
 */

export const createWorkspace        = createStructFactory<Workspace>(WORKSPACE, {
  visualEditorSettings: {
    translate: { left: 0, top: 0, zoom: 1 },
    showLeftGutter: true,
    showRightGutter: true,
  },
  selectionIds: [],
  hoveringIds: [],
  secondarySelection: false
});

export const createApplicationState = createStructFactory<ApplicationState>(APPLICATION_STATE, {
  workspaces: [],
  shortcuts:[
    createKeyboardShortcut("backspace", deleteShortcutPressed()),
    createKeyboardShortcut("meta+b", toggleLeftGutterPressed()),
    createKeyboardShortcut("meta+/", toggleRightGutterPressed())
  ],
  fileCache: createFileCache()
});

export const getStageToolMouseNodeTargetUID = (state: ApplicationState, event: StageToolOverlayMouseMoved|StageToolOverlayClicked) => {
  const { sourceEvent, windowId } = event as StageToolOverlayMouseMoved;
  const window = getSyntheticWindow(state, windowId);
  const workspace = getSyntheticWindowWorkspace(state, windowId);
  const zoom = workspace.visualEditorSettings.translate.zoom;

  // TODO - move to reducer
  const target = sourceEvent.nativeEvent.target as Element;
  const rect = target.getBoundingClientRect();
  const mouseX = sourceEvent.pageX - rect.left;
  const mouseY = sourceEvent.pageY - rect.top;

  const computedBoxes = window.computedBoxes;
  const intersectingBoxes: Box[] = [];
  const intersectingBoxMap = new Map<Box, string>();
  for (const uid in computedBoxes) {
    const box = computedBoxes[uid];
    if (pointIntersectsBox({ left: mouseX, top: mouseY }, zoomBox(box, zoom))) {
      intersectingBoxes.push(box);
      intersectingBoxMap.set(box, uid);
    }
  }
  const smallestBox = getSmallestBox(...intersectingBoxes);
  const uid = intersectingBoxMap.get(smallestBox);
  return uid;
}

export * from "./shortcuts";
export * from "aerial-browser-sandbox/src/state";