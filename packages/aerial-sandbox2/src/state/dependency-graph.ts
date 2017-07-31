import { Struct, createStructFactory } from "aerial-common2";

/**
 * Types
 */

export const DEPENDENCY       = "DEPENDENCY";
export const DEPENDENCY_GRAPH = "DEPENDENCY_GRAPH";

/**
 * Structs
 */

export type Dependency = {

  /**
   * The URI of the dependency
   */

  uri: string;

  /**
   */

  dependencyIds: string[];
} & Struct;

export type DependencyGraph = {

  /**
   * All dependencies that are loaded in the sandbox -- these are
   * shared across 
   */

  allDependencies: {
    [identifer: string]: Dependency
  }
} & Struct;

/**
 * Factories
 */

 export const createDependency = createStructFactory(DEPENDENCY, {
   dependencyIds: []
 });

export const createDependencyGraph = createStructFactory(DEPENDENCY_GRAPH, {
  allDependencies: {}
});
