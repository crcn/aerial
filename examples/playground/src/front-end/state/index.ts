import {
  Struct,
  Boxed,
  Action,
  TreeNode,
  weakMemo,
  Translate,
  getPathById,
  filterBoxed,
  getValueById,
  mergeBoxes,
  updateStruct,
  ImmutableArray, 
  getValueByPath,
  findParentObject,
  ImmutableObject,
  createStructFactory,
  BaseApplicationState,
  updateStructProperty,
  createImmutableObject,
  createImmutableArray,
  ExpressionPosition,
  ImmutableArrayIdentity,
  ImmutableObjectIdentity,
  createImmutableStructFactory,
} from "aerial-common2";
import { createFileCache, FileCache, FileCacheItem } from "aerial-sandbox2";

import { Shortcut, ShortcutServiceState, createKeyboardShortcut } from "./shortcuts";
import { toggleLeftGutterPressed, toggleRightGutterPressed, deleteShortcutPressed } from "front-end/actions";

import {
  SyntheticBrowser,
  getSyntheticNodeById,
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

export const getBoxedWorkspaceSelection = weakMemo((workspace: Workspace): Array<Boxed & Struct> => filterBoxed(workspace.selectionIds.map(id => getValueById(workspace, id))) as any);
export const getWorkspaceSelectionBox = weakMemo((workspace: Workspace) => mergeBoxes(...getBoxedWorkspaceSelection(workspace).map(boxed => boxed.box)));

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

export * from "./shortcuts";