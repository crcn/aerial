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
  SYNTHETIC_ELEMENT,
  getSyntheticWindow,
  getSyntheticNodeById,
  getSyntheticNodeWindow,
  getSyntheticBrowser,
  SyntheticWindow,
  getSyntheticBrowserItemBounds,
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
  fullScreenWindowId?: string,
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

export type Workspace = {
  selectionRefs: StructReference[]; // $type:$id;
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

export const getFrontEndItemByReference = (root: ApplicationState|SyntheticBrowser, ref: StructReference) => {
  return getSyntheticBrowserStoreItemByReference(root, ref);
};

export const getSyntheticNodeWorkspace = weakMemo((root: ApplicationState, nodeId: string): Workspace => {
  return getSyntheticWindowWorkspace(root, getSyntheticNodeWindow(root, nodeId).$id);
});

export const getBoundedWorkspaceSelection = weakMemo((state: ApplicationState|SyntheticBrowser, workspace: Workspace): Array<Bounded & Struct> => workspace.selectionRefs.map((ref) => getFrontEndItemByReference(state, ref)).filter(item => getSyntheticBrowserItemBounds(state, item)));
export const getWorkspaceSelectionBounds = weakMemo((state: ApplicationState|SyntheticBrowser, workspace: Workspace) => mergeBounds(...getBoundedWorkspaceSelection(state, workspace).map(boxed => getSyntheticBrowserItemBounds(state, boxed))));

export const getStageZoom = (stage: Stage) => getStageTranslate(stage).zoom;

export const getStageTranslate = weakMemo((stage: Stage) => stage.fullScreenWindowId ? { left: 0, top: 0, zoom: 1 } : stage.translate);

export const getWorkspaceById = (state: ApplicationState, id: string): Workspace => state.workspaces.find((workspace) => workspace.$id === id);
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
    createKeyboardShortcut("meta+/", toggleRightGutterPressed()),
    createKeyboardShortcut("meta+e", toggleTextEditorPressed()),
    createKeyboardShortcut("meta+f", fullScreenShortcutPressed()),
    createKeyboardShortcut("meta+=", zoomInShortcutPressed()),
    createKeyboardShortcut("meta+-", zoomOutShortcutPressed()),
    createKeyboardShortcut("meta+t", openNewWindowShortcutPressed()),
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

  let window: SyntheticWindow;
  let scaledPageX: number;
  let scaledPageY: number;

  if (stage.fullScreenWindowId) {
    window = getSyntheticWindow(state, stage.fullScreenWindowId);
    scaledPageX = pageX + window.bounds.left;
    scaledPageY = pageY + window.bounds.top;
  } else {

    const translate = getStageTranslate(stage);
    
    scaledPageX = ((pageX - translate.left) / translate.zoom);
    scaledPageY = ((pageY - translate.top) / translate.zoom);

    const browser  = getSyntheticBrowser(state, workspace.browserId);
    window = browser.windows.find((window) => (
      pointIntersectsBounds({ left: scaledPageX, top: scaledPageY }, window.bounds)
    ));
  }

  if (!window) return null;

  // TODO - move to reducer
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