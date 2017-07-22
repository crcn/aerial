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

import {
  SyntheticBrowser,
} from "aerial-synthetic-browser";

import { ReactServiceState } from "../react";


export namespace Types {
  export const FILE              = "FILE";
  export const DIRECTORY         = "DIRECTORY";
  export const WORKSPACE         = "WORKSPACE";
  export const APPLICATION_STATE = "APPLICATION_STATE";
}

export interface File extends Struct, TreeNode<any> {
  name: string;
  content?: string;
}

export const getFileExtension = (file: File) => file.name.split(".").pop();

export interface Directory extends Struct, File {
  
}

export type Editor = { }

export type Workspace = {

  /**
   */

  selectedFileId?: string;

  /**
   * directory to the source files of this
   * workspace
   */

  sourceFilesDirectory: Directory;
  
  /**
   * The synthetic browser instance.
   */

  browser: SyntheticBrowser;

  /**
   * text / visual editor state
   */

  editors: Editor[];

} & Struct;

export const getSelectedWorkspaceFile = (workspace: Workspace): File => workspace.selectedFileId && getValueById(workspace, workspace.selectedFileId);

/**
 * entire application state
 */

export type ApplicationState = {
  workspaces: Workspace[],
  selectedWorkspaceId?: string
} & BaseApplicationState & ReactServiceState & Struct;

export const getSelectedWorkspace = (state: ApplicationState): Workspace => state.selectedWorkspaceId && getValueById(state, state.selectedWorkspaceId);
export const getSelectedWorkspacePath = (state: ApplicationState) => getPathById(state, state.selectedWorkspaceId);

/**
 * Factories
 */

export const createWorkspace        = createImmutableStructFactory<Workspace>(Types.WORKSPACE, {
  editors: []
});

export const createApplicationState = createImmutableStructFactory<ApplicationState>(Types.APPLICATION_STATE, {
  workspaces: []
});

export const createFile             = createImmutableStructFactory<File>(Types.FILE);
export const createDirectory        = createImmutableStructFactory<Directory>(Types.DIRECTORY, { 
  childNodes: [] 
});

/*
  const state = createApplicationState();


  const reduceApplicationState = combineReducers({
    workspaces: reduceWorkspace
  });
*/