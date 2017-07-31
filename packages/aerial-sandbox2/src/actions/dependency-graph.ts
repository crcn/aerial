import { Request } from "aerial-common2";

/**
 * Types
 */

export const ADD_DEPENDENCY_GRAPH_ITEM_REQUEST = "ADD_DEPENDENCY_GRAPH_ITEM_REQUEST";

/**
 * Structs
 */

export type AddDependencyGraphItemRequest = {
  uri: string
} & Request;

/**
 * Factories
 */

export const createAddDependencyGraphItemRequest = (uri: string): AddDependencyGraphItemRequest => ({
  uri,
  type: ADD_DEPENDENCY_GRAPH_ITEM_REQUEST
})