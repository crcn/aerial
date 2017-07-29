import {
  Struct,
  TreeNode,
  weakMemo,
  Translate,
  getPathById,
  filterBoxed,
  getValueById,
  updateStruct,
  ImmutableArray, 
  getValueByPath,
  ImmutableObject,
  createStructFactory,
  BaseApplicationState,
  updateStructProperty,
  createImmutableObject,
  createImmutableArray,
  ImmutableArrayIdentity,
  ImmutableObjectIdentity,
  createImmutableStructFactory,
} from "aerial-common2";

import {
  uniq,
  difference,
} from "lodash";

import { Kernel } from "aerial-common";

import {
  SyntheticBrowser,
  SyntheticBrowser2,
} from "aerial-synthetic-browser";

import { MainServiceState } from "front-end/services";

/**
 * Types
 */

export const FILE              = "FILE";
export const DIRECTORY         = "DIRECTORY";
export const WORKSPACE         = "WORKSPACE";
export const APPLICATION_STATE = "APPLICATION_STATE";

/**
 * Structs
 */

export interface File extends Struct, TreeNode<any> {
  name: string;
  content?: string;
}

export type Directory = File;

export type VisualEditorSettings = {
  translate: Translate;
  cursor?: string;
}

export type Workspace = {

  /**
   */

  selectionIds: string[];
  
  /**
   */

  selectedFileId?: string;

  /**
   * directory to the source files of this
   * workspace
   */

  sourceFiles: Directory;

  /**
   */

  publicDirectoryId: string;

  /**
   */

  mainFileId: string;
  
  /**
   * The synthetic browser instance.
   */

  browser: SyntheticBrowser2;

  /**
   */
  
  visualEditorSettings: VisualEditorSettings;

} & Struct;


export type ApplicationState = {
  kernel: Kernel,
  workspaces: Workspace[],
  selectedWorkspaceId?: string
} & BaseApplicationState & MainServiceState & Struct;

/**
 * Utilities
 */

export const getFileExtension = (file: File) => file.name.split(".").pop();

export const getWorkspaceMainFile = (workspace: Workspace): File => getValueById(workspace.sourceFiles, workspace.mainFileId);
export const getSelectedWorkspaceFile = (workspace: Workspace): File => workspace.selectedFileId && getValueById(workspace, workspace.selectedFileId);
export const getSelectedWorkspacePublicDirectory = (workspace: Workspace): File => getValueById(workspace.sourceFiles, workspace.publicDirectoryId);

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
  return updateStructProperty(root, workspace, "selectionIds", uniq([...workspace.selectionIds, ...selectionIds]));
}

export const getBoxedWorkspaceSelection = weakMemo((workspace: Workspace) => filterBoxed(workspace.selectionIds.map(id => getValueById(workspace, id))));

export const removeWorkspaceSelection = (root: any, workspaceId: string, ...selectionIds: string[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateStructProperty(root, workspace, "selectionIds", difference(workspace.selectionIds, selectionIds));
}

export const clearWorkspaceSelection = (root: any, workspaceId: string) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateStructProperty(root, workspace, "selectionIds", []);
}

export const getWorkspaceById = (state: ApplicationState, id: string): Workspace => getValueById(state, id);
export const getSelectedWorkspace = (state: ApplicationState) => state.selectedWorkspaceId && getWorkspaceById(state, state.selectedWorkspaceId);
export const getSelectedWorkspacePath = (state: ApplicationState) => getPathById(state, state.selectedWorkspaceId);

/**
 * Factories
 */

export const createWorkspace        = createStructFactory<Workspace>(WORKSPACE, {
  visualEditorSettings: {
    translate: { left: 0, top: 0, zoom: 1 }
  },
  selectionIds: []
});

export const createApplicationState = createStructFactory<ApplicationState>(APPLICATION_STATE, {
  workspaces: []
});

export const createFile             = createStructFactory<File>(FILE);
export const createDirectory        = createStructFactory<Directory>(DIRECTORY, { 
  childNodes: [] 
});

export const getAllFilesByPath = weakMemo((state: ApplicationState|Workspace, prefix: string = "") => {
  let files = {};
  const getFilesByUrl2 = (dir: Directory, prefix = '') => {
    for (const doc of dir.childNodes) {
      const newPrefix = `${prefix}/${doc.name}`;
      if (doc.$$type === DIRECTORY) {
        files = {...files, ...getFilesByUrl2(doc, newPrefix)};
      } else {
        files[newPrefix] = doc;
      }
    }
    return files;
  };

  if (state.$$type === APPLICATION_STATE) {
    for (const workspace of (state as ApplicationState).workspaces) {
      files = {
        ...files,
        ...getFilesByUrl2(workspace.sourceFiles, `${prefix}${workspace.$$id}`)
      };
    }
  } else if (state.$$type === WORKSPACE) {
    const workspace = state as Workspace;
    files = getFilesByUrl2(workspace.sourceFiles, `${prefix}${workspace.$$id}`);
  }

  return files;
});

export const getWorkspaceMainFilePath = weakMemo((workspace: Workspace) => {
  const file = getWorkspaceMainFile(workspace);
  const allPaths = getAllFilesByPath(workspace);
  for (const path in allPaths) {
    if (allPaths[path].$$id === file.$$id) {
      return path;
    }
  }
});