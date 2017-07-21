import {
  Struct,
  TreeNode,
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
export type File = {
  name: string
} & Struct;

export type Directory = TreeNode<{
  name: string,
  files: Array<Directory | File>[];
}> & Struct;

export type Editor = { }

export type Workspace = {

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

/**
 * entire application state
 */

export type ApplicationState = {
  workspaces: Workspace[]
} & BaseApplicationState & ReactServiceState & Struct;

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
  files: [] 
});

/*
  const state = createApplicationState();


  const reduceApplicationState = combineReducers({
    workspaces: reduceWorkspace
  });
*/