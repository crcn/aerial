import {
  Bounds,
  Bounded,
  Action,
  Struct,
  shiftBounds,
  zoomBounds,
  TreeNode,
  weakMemo,
  Translate,
  mergeBounds,
  filterBounded,
  getSmallestBounds,
  ImmutableArray, 
  StructReference,
  arrayReplaceIndex,
  ImmutableObject,
  getStructReference,
  ExpressionPosition,
  pointIntersectsBounds,
  createStructFactory,
  getReferenceString,
  BaseApplicationState,
  createImmutableArray,
  createImmutableObject,
  ImmutableArrayIdentity,
  ImmutableObjectIdentity,
  createImmutableStructFactory,
} from "aerial-common2";
import { createFileCacheStore, FileCacheRootState, FileCacheItem, getFileCacheItemById } from "aerial-sandbox2";

import { StageToolOverlayMouseMoved, StageToolOverlayClicked } from "../actions";
import { Shortcut, ShortcutServiceState, createKeyboardShortcut } from "./shortcuts";
import { toggleLeftGutterPressed, toggleRightGutterPressed, deleteShortcutPressed } from "front-end/actions";

import {
  SyntheticBrowser,
  SYNTHETIC_ELEMENT,
  getSyntheticWindow,
  getSyntheticNodeById,
  getSyntheticNodeWindow,
  getSyntheticBrowserBounds,
  getSyntheticWindowBrowser,
  SyntheticBrowserRootState,
  createSyntheticBrowserStore,
  getSyntheticBrowserStoreItemByReference,
} from "aerial-browser-sandbox";

import {
  uniq,
  difference,
  differenceWith
} from "lodash";

import { Kernel } from "aerial-common";


/**
 * Types
 */

export const FILE              = "FILE";
export const DIRECTORY         = "DIRECTORY";
export const WORKSPACE         = "WORKSPACE";
export const APPLICATION_STATE = "APPLICATION_STATE";

export type Stage = {
  panning: boolean;
  backgroundColor?: string;
  translate: Translate;
  cursor?: string;
  showTextEditor?: boolean;
  showLeftGutter?: boolean;
  showRightGutter?: boolean;
}

export type Workspace = {
  selectionRefs: StructReference[]; // $$type:$$id;
  browserId: string;
  hoveringRefs: StructReference[];
  selectedFileId?: string;
  stage: Stage;
  textCursorPosition: ExpressionPosition;
  secondarySelection?: boolean;
} & Struct;

export type ApplicationState = {
  kernel: Kernel;
  workspaces: Workspace[];
  selectedWorkspaceId?: string;
  element: HTMLElement;
  apiHost: string;
} & BaseApplicationState &  ShortcutServiceState & SyntheticBrowserRootState & FileCacheRootState & Struct;

/**
 * Utilities
 */

export const getFileExtension = (file: FileCacheItem) => file.sourceUri.split(".").pop();

export const getSelectedWorkspaceFile = (state: ApplicationState, workspace: Workspace): FileCacheItem => {
  return workspace.selectedFileId && getFileCacheItemById(state, workspace.selectedFileId);
}

export const getSyntheticWindowWorkspace = (root: ApplicationState, windowId: string): Workspace => getSyntheticBrowserWorkspace(root, getSyntheticWindowBrowser(root, windowId).$$id);

export const getSyntheticBrowserWorkspace = weakMemo((root: ApplicationState, browserId: string) => {
  return root.workspaces.find(workspace => workspace.browserId === browserId);
});

export const addWorkspaceSelection = (root: any, workspaceId: string, ...selection: StructReference[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...workspace.selectionRefs, ...selection);
};

export const removeWorkspaceSelection = (root: any, workspaceId: string, ...selection: StructReference[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...workspace.selectionRefs.filter((type, id) => !selection.find((type2, id2) => id === id2)));
}

const diffStructReferences = (a: StructReference[], b: StructReference[]) => {
  return differenceWith(a, b, (a, b) => a[1] === b[1]);
}

export const toggleWorkspaceSelection = (root: any, workspaceId: string, ...selection: StructReference[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...diffStructReferences(selection, workspace.selectionRefs));
};

export const clearWorkspaceSelection = (root: any, workspaceId: string) => {
  return updateWorkspace(root, workspaceId, {
    selectionRefs: [],
    secondarySelection: false
  });
};

export const setWorkspaceSelection = (root: any, workspaceId: string, ...selectionIds: StructReference[]) => {
  return updateWorkspace(root, workspaceId, {
    selectionRefs: uniq([...selectionIds])
  });
};

export const updateWorkspace = (root: ApplicationState, workspaceId: string, newProperties: Partial<Workspace>) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return {
    ...root,
    workspaces: arrayReplaceIndex(root.workspaces, root.workspaces.indexOf(workspace), {
      ...workspace,
      ...newProperties
    })
  }
};

export const addWorkspace = (root: ApplicationState, workspace: Workspace) => {
  return {
    ...root,
    workspaces: [...root.workspaces, workspace]
  };
}

const getFrontEndItemByReference = (root: ApplicationState|SyntheticBrowser, ref: StructReference) => {
  return getSyntheticBrowserStoreItemByReference(root, ref);
};

export const getSyntheticNodeWorkspace = weakMemo((root: ApplicationState, nodeId: string): Workspace => {
  return getSyntheticWindowWorkspace(root, getSyntheticNodeWindow(root, nodeId).$$id);
});

export const getBoundedWorkspaceSelection = weakMemo((state: ApplicationState|SyntheticBrowser, workspace: Workspace): Array<Bounded & Struct> => workspace.selectionRefs.map((ref) => getFrontEndItemByReference(state, ref)).filter(item => getSyntheticBrowserBounds(state, item)));
export const getWorkspaceSelectionBounds = weakMemo((state: ApplicationState|SyntheticBrowser, workspace: Workspace) => mergeBounds(...getBoundedWorkspaceSelection(state, workspace).map(boxed => getSyntheticBrowserBounds(state, boxed))));

export const getWorkspaceById = (state: ApplicationState, id: string): Workspace => state.workspaces.find((workspace) => workspace.$$id === id);
export const getSelectedWorkspace = (state: ApplicationState) => state.selectedWorkspaceId && getWorkspaceById(state, state.selectedWorkspaceId);

/**
 * Factories
 */

export const createWorkspace        = createStructFactory<Workspace>(WORKSPACE, {
  stage: {
    panning: false,
    translate: { left: 0, top: 0, zoom: 1 },
    showTextEditor: false,
    showLeftGutter: true,
    showRightGutter: true,
  },
  selectionRefs: [],
  hoveringRefs: [],
  secondarySelection: false
});

export const createApplicationState = createStructFactory<ApplicationState>(APPLICATION_STATE, {
  workspaces: [],
  shortcuts:[
    createKeyboardShortcut("backspace", deleteShortcutPressed()),
    createKeyboardShortcut("meta+b", toggleLeftGutterPressed()),
    createKeyboardShortcut("meta+/", toggleRightGutterPressed())
  ],
  fileCacheStore: createFileCacheStore(),
  browserStore: createSyntheticBrowserStore()
});

export const selectWorkspace = (state: ApplicationState, selectedWorkspaceId: string) => ({
  ...state,
  selectedWorkspaceId,
})

export const getStageToolMouseNodeTargetReference = (state: ApplicationState, event: StageToolOverlayMouseMoved|StageToolOverlayClicked) => {
  const { sourceEvent, windowId } = event as StageToolOverlayMouseMoved;
  const window = getSyntheticWindow(state, windowId);
  const workspace = getSyntheticWindowWorkspace(state, windowId);
  const zoom = workspace.stage.translate.zoom;

  // TODO - move to reducer
  const target = sourceEvent.nativeEvent.target as Element;
  const rect = target.getBoundingClientRect();
  const mouseX = sourceEvent.pageX - rect.left;
  const mouseY = sourceEvent.pageY - rect.top;

  const allComputedBounds = window.allComputedBounds;
  const intersectingBounds: Bounds[] = [];
  const intersectingBoundsMap = new Map<Bounds, string>();
  for (const uid in allComputedBounds) {
    const box = allComputedBounds[uid];
    if (pointIntersectsBounds({ left: mouseX, top: mouseY }, zoomBounds(box, zoom))) {
      intersectingBounds.push(box);
      intersectingBoundsMap.set(box, uid);
    }
  }
  if (!intersectingBounds.length) return null;
  const smallestBounds = getSmallestBounds(...intersectingBounds);
  return [SYNTHETIC_ELEMENT, intersectingBoundsMap.get(smallestBounds)] as [string, string];
}

export * from "./shortcuts";
export * from "aerial-browser-sandbox/src/state";