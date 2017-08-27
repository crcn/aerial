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
  Point,
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
import { 
  zoomInShortcutPressed,
  escapeShortcutPressed,
  deleteShortcutPressed,
  zoomOutShortcutPressed,
  toggleTextEditorPressed,
  toggleLeftGutterPressed, 
  toggleRightGutterPressed, 
  fullScreenShortcutPressed,
  cloneWindowShortcutPressed,
  openNewWindowShortcutPressed,
} from "front-end/actions";

import {
  SyntheticBrowser,
  SYNTHETIC_WINDOW,
  SYNTHETIC_ELEMENT,
  getSyntheticWindow,
  getSyntheticNodeById,
  getSyntheticNodeWindow,
  getSyntheticBrowser,
  SyntheticWindow,
  syntheticNodeIsRelative,
  getSyntheticBrowserItemBounds,
  getSyntheticWindowBrowser,
  SyntheticBrowserRootState,
  createSyntheticBrowserStore,
  syntheticWindowContainsNode,
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
  secondarySelection?: boolean;
  fullScreen?: {
    windowId: string,
    originalTranslate: Translate;
    originalWindowBounds: Bounds,
  },
  panning: boolean;
  movingOrResizing?: boolean;
  mousePosition?: Point;
  container?: HTMLDivElement;
  smooth?: boolean;
  backgroundColor?: string;
  translate: Translate;
  cursor?: string;
  showTextEditor?: boolean;
  showLeftGutter?: boolean;
  showRightGutter?: boolean;
}

export type TextEditor = {
  cursorPosition?: ExpressionPosition;
};

export type Workspace = {
  selectionRefs: StructReference[]; // $type:$id;
  browserId: string;
  hoveringRefs: StructReference[];
  selectedFileId?: string;
  stage: Stage;
  textEditor: TextEditor;
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

export const getSyntheticWindowWorkspace = (root: ApplicationState, windowId: string): Workspace => getSyntheticBrowserWorkspace(root, getSyntheticWindowBrowser(root, windowId).$id);

export const showWorkspaceTextEditor = (root: ApplicationState, workspaceId: string): ApplicationState => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateWorkspaceStage(root, workspaceId, {
    showTextEditor: true
  });
};

export const updateWorkspaceStage = (root: ApplicationState, workspaceId: string, stageProperties: Partial<Stage>): ApplicationState => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateWorkspace(root, workspaceId, {
    stage: {
      ...workspace.stage,
      ...stageProperties
    }
  });
};

export const updateWorkspaceTextEditor = (root: ApplicationState, workspaceId: string, textEditorProperties: Partial<TextEditor>): ApplicationState => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateWorkspace(root, workspaceId, {
    textEditor: {
      ...workspace.textEditor,
      ...textEditorProperties
    }
  });
};

export const getSyntheticBrowserWorkspace = weakMemo((root: ApplicationState, browserId: string) => {
  return root.workspaces.find(workspace => workspace.browserId === browserId);
});

export const addWorkspaceSelection = (root: ApplicationState, workspaceId: string, ...selection: StructReference[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...workspace.selectionRefs, ...selection);
};

export const removeWorkspaceSelection = (root: ApplicationState, workspaceId: string, ...selection: StructReference[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...workspace.selectionRefs.filter((type, id) => !selection.find((type2, id2) => id === id2)));
}

/**
 * Utility to ensure that workspace selection items are within the same window object. This prevents users from selecting
 * the _same_ element across different window objects. 
 */

const deselectOutOfScopeWorkpaceSelection = (root: ApplicationState, workspaceId: string, ref: StructReference) => {
  
  if (ref && ref[0] === SYNTHETIC_WINDOW) {
    return root;
  }

  const window = getSyntheticNodeWindow(root, ref[1]);

  const workspace = getWorkspaceById(root, workspaceId);
  const updatedSelection: StructReference[] = [];

  for (const selection of workspace.selectionRefs)   {
    if (syntheticWindowContainsNode(window, selection[1])) {
      updatedSelection.push(selection);
    }
  }

  return setWorkspaceSelection(root, workspaceId, ...updatedSelection);
};

/**
 * Prevents nodes that have a parent/child relationship from being selected.
 */

const deselectRelatedWorkspaceSelection = (root: ApplicationState, workspaceId: string, ref: StructReference) => {
  
  if (ref && ref[0] === SYNTHETIC_WINDOW) {
    return root;
  }

  const workspace = getWorkspaceById(root, workspaceId);
  const window = getSyntheticNodeWindow(root, ref[1]);
  const updatedSelection: StructReference[] = [];

  for (const selection of workspace.selectionRefs)   {
    if (!syntheticNodeIsRelative(window, ref[1], selection[1])) {
      updatedSelection.push(selection);
    }
  }

  return setWorkspaceSelection(root, workspaceId, ...updatedSelection);
};

// deselect unrelated refs, ensures that selection is not a child of existing one. etc.
const cleanupWorkspaceSelection = (state: ApplicationState, workspaceId: string) => {
  const workspace = getWorkspaceById(state, workspaceId);
  
  if (workspace.selectionRefs.length > 0) {

    // use _last_ selected element since it's likely the one that was just clicked. Don't want to prevent the 
    // user from doing so
    state = deselectOutOfScopeWorkpaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
    state = deselectRelatedWorkspaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
  }

  return state;
}

export const toggleWorkspaceSelection = (root: ApplicationState, workspaceId: string, ...selection: StructReference[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  const newSelection = [];
  const oldSelectionIds = workspace.selectionRefs.map(([type, id]) => id)
  const toggleSelectionIds = selection.map(([type, id]) => id);
  for (const ref of workspace.selectionRefs) {
    if (toggleSelectionIds.indexOf(ref[1]) === -1) {
      newSelection.push(ref);
    }
  }
  for (const ref of selection) {
    if (oldSelectionIds.indexOf(ref[1]) === -1) {
      newSelection.push(ref);
    }
  }

  return cleanupWorkspaceSelection(setWorkspaceSelection(root, workspaceId, ...newSelection), workspaceId);
};

export const clearWorkspaceSelection = (root: ApplicationState, workspaceId: string) => {
  return updateWorkspaceStage(updateWorkspace(root, workspaceId, {
    selectionRefs: []
  }), workspaceId, {
    secondarySelection: false
  });
};

export const setWorkspaceSelection = (root: ApplicationState, workspaceId: string, ...selectionIds: StructReference[]) => {
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

export const getFrontEndItemByReference = (root: ApplicationState|SyntheticBrowser, ref: StructReference) => {
  return getSyntheticBrowserStoreItemByReference(root, ref);
};

export const getSyntheticNodeWorkspace = weakMemo((root: ApplicationState, nodeId: string): Workspace => {
  return getSyntheticWindowWorkspace(root, getSyntheticNodeWindow(root, nodeId).$id);
});

export const getBoundedWorkspaceSelection = weakMemo((state: ApplicationState|SyntheticBrowser, workspace: Workspace): Array<Bounded & Struct> => workspace.selectionRefs.map((ref) => getFrontEndItemByReference(state, ref)).filter(item => getSyntheticBrowserItemBounds(state, item)));
export const getWorkspaceSelectionBounds = weakMemo((state: ApplicationState|SyntheticBrowser, workspace: Workspace) => mergeBounds(...getBoundedWorkspaceSelection(state, workspace).map(boxed => getSyntheticBrowserItemBounds(state, boxed))));

export const getStageZoom = (stage: Stage) => getStageTranslate(stage).zoom;

export const getStageTranslate = (stage: Stage) => stage.translate;

export const getWorkspaceById = (state: ApplicationState, id: string): Workspace => state.workspaces.find((workspace) => workspace.$id === id);
export const getSelectedWorkspace = (state: ApplicationState) => state.selectedWorkspaceId && getWorkspaceById(state, state.selectedWorkspaceId);

/**
 * Factories
 */

export const createWorkspace        = createStructFactory<Workspace>(WORKSPACE, {
  stage: {
    panning: false,
    secondarySelection: false,
    translate: { left: 0, top: 0, zoom: 1 },
    showTextEditor: false,
    showLeftGutter: true,
    showRightGutter: true,
  },
  textEditor: {},
  selectionRefs: [],
  hoveringRefs: []
});

export const createApplicationState = createStructFactory<ApplicationState>(APPLICATION_STATE, {
  workspaces: [],
  shortcuts:[
    createKeyboardShortcut("backspace", deleteShortcutPressed()),
    createKeyboardShortcut("meta+b", toggleLeftGutterPressed()),
    createKeyboardShortcut("meta+/", toggleRightGutterPressed()),
    createKeyboardShortcut("meta+e", toggleTextEditorPressed()),
    createKeyboardShortcut("meta+f", fullScreenShortcutPressed()),
    createKeyboardShortcut("ctrl+f", fullScreenShortcutPressed()),
    createKeyboardShortcut("meta+=", zoomInShortcutPressed()),
    createKeyboardShortcut("meta+-", zoomOutShortcutPressed()),
    createKeyboardShortcut("meta+t", openNewWindowShortcutPressed()),
    createKeyboardShortcut("ctrl+t", openNewWindowShortcutPressed()),
    createKeyboardShortcut("meta+enter", cloneWindowShortcutPressed()),
    createKeyboardShortcut("escape", escapeShortcutPressed())
  ],
  fileCacheStore: createFileCacheStore(),
  browserStore: createSyntheticBrowserStore()
});

export const selectWorkspace = (state: ApplicationState, selectedWorkspaceId: string) => ({
  ...state,
  selectedWorkspaceId,
});

export const getStageToolMouseNodeTargetReference = (state: ApplicationState, event: StageToolOverlayMouseMoved|StageToolOverlayClicked) => {
  const { sourceEvent: { pageX, pageY, nativeEvent } } = event as StageToolOverlayMouseMoved;
  

  const workspace = getSelectedWorkspace(state);
  const stage     = workspace.stage;

  const translate = getStageTranslate(stage);
  
  const scaledPageX = ((pageX - translate.left) / translate.zoom);
  const scaledPageY = ((pageY - translate.top) / translate.zoom);

  const browser  = getSyntheticBrowser(state, workspace.browserId);
  const window = stage.fullScreen ? getSyntheticWindow(state, stage.fullScreen.windowId) : browser.windows.find((window) => (
    pointIntersectsBounds({ left: scaledPageX, top: scaledPageY }, window.bounds)
  ));

  if (!window) return null;

  const mouseX = scaledPageX - window.bounds.left;
  const mouseY = scaledPageY - window.bounds.top;

  const allComputedBounds = window.allComputedBounds;
  const intersectingBounds: Bounds[] = [];
  const intersectingBoundsMap = new Map<Bounds, string>();
  for (const $id in allComputedBounds) {
    const bounds = allComputedBounds[$id];
    if (pointIntersectsBounds({ left: mouseX, top: mouseY }, bounds)) {
      intersectingBounds.push(bounds);
      intersectingBoundsMap.set(bounds, $id);
    }
  }
  if (!intersectingBounds.length) return null;
  const smallestBounds = getSmallestBounds(...intersectingBounds);
  return [SYNTHETIC_ELEMENT, intersectingBoundsMap.get(smallestBounds)] as [string, string];
}

export * from "./shortcuts";
export * from "aerial-browser-sandbox/src/state";