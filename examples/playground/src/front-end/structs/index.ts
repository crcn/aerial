import { 
  ImmutableArray, 
  ImmutableObject,
  createImmutableObject,
  createImmutableArray,
  ImmutableArrayIdentity,
  ImmutableObjectIdentity,
  createImmutableStructFactory,
} from "aerial-common";

import {
  SyntheticBrowser,
} from "aerial-synthetic-browser";

export namespace Types {
  export const WORKSPACE = "workspace";
}

export type Workspace = {
  
  /**
   * The synthetic browser instance
   * TODO - this needs to be a reference object
   */

  browser: SyntheticBrowser;
};

export const createWorkspace = createImmutableStructFactory<Workspace>(Types.WORKSPACE);

/**
 * entire application state
 */

export const ApplicationState: ImmutableObjectIdentity<{
  workspaces: Workspace[]
}> = ImmutableObject;
