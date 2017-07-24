import {
  Struct,
  TreeNode,
  getPathById,
  getValueById,
  ImmutableArray, 
  ImmutableObject,
  BaseApplicationState,
  createImmutableObject,
  createImmutableArray,
  ImmutableArrayIdentity,
  ImmutableObjectIdentity,
  createImmutableStructFactory,
} from "aerial-common2";

import { Kernel } from "aerial-common";

import {
  SyntheticBrowser,
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

export interface Directory extends Struct, File { }

export type Editor = { }

export type Workspace = {

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

  browser: SyntheticBrowser;

  /**
   * text / visual editor state
   */

  editors: Editor[];

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


export const getSelectedWorkspace = (state: ApplicationState): Workspace => state.selectedWorkspaceId && getValueById(state, state.selectedWorkspaceId);
export const getSelectedWorkspacePath = (state: ApplicationState) => getPathById(state, state.selectedWorkspaceId);

/**
 * Factories
 */

export const createWorkspace        = createImmutableStructFactory<Workspace>(WORKSPACE, {
  editors: []
});

export const createApplicationState = createImmutableStructFactory<ApplicationState>(APPLICATION_STATE, {
  workspaces: []
});

export const createFile             = createImmutableStructFactory<File>(FILE);
export const createDirectory        = createImmutableStructFactory<Directory>(DIRECTORY, { 
  childNodes: [] 
});
