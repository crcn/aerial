import { mapImmutable } from "aerial-common";
import { 
  Workspace,
  createWorkspace,
  ApplicationState,
  createApplicationState, 
} from "../structs";

// TODO - combine reducers here

export const reduceApplicationState = (state: ApplicationState = createApplicationState(), event) => {
  return mapImmutable(state, {
    workspaces: reduceWorkspace
  })
};

export const reduceWorkspace = (state: Workspace, event) => {

};