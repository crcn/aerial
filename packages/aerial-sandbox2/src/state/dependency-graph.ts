import { 
  Struct, 
  weakMemo,
  ErrorShape, 
  getValueById,
  getValuesByType, 
  createStructFactory, 
} from "aerial-common2";
import {
  difference,
} from "lodash";

/**
 * Types
 */

export const DEPENDENCY       = "DEPENDENCY";
export const DEPENDENCY_GRAPH = "DEPENDENCY_GRAPH";

export enum DependencyStatus {
  IDLE,
  CONTENT_LOADED,
  READY,
};

/**
 * Structs
 */

export type Dependency = {

  /**
   */

  hash: string;

  /**
   */

  status: DependencyStatus;

  /**
   * The URI of the dependency
   */

  uri: string;

  /**
   */

  importedDependencyIds: string[];

  /**
   */

  importedDependencyHashes: string[];

  /**
   */

  content: string|Buffer;

  /**
   */

  contentType: string;

  /**
   */

  contentLoaderOptions?: any;
  
  /**
   */

   error: ErrorShape;
} & Struct;

/**
 */

export type ResolvedDependencyInfo = {

  /**
   */

  hash: string;

  /**
   * Resolved file path
   */

  uri: string;

  /**
   * The loader for the file path
   */

  contentLoaderOptions?: any;
}

/**
 */

export type LoadedDependencyContentResult = {

  /**
   */

  content: string|Buffer;

  /**
   * Resolved file path
   */

  contentType: string;

  /**
   * The loader for the file path
   */

  importedDependencyUris: string[];
}

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
   status: DependencyStatus.IDLE,
   dependencyIds: []
 });

export const createDependencyGraph = createStructFactory(DEPENDENCY_GRAPH, {
  allDependencies: {}
});

export const getDependencyGraph = (root: any): DependencyGraph => getValuesByType(root, DEPENDENCY_GRAPH)[0];

export const getDependency = (root: any, dependencyId: string): Dependency => getValueById(root, dependencyId);

export const isDependencyTreeLoaded = weakMemo((root: any, hash: string) => {
  const graph = getDependencyGraph(root);
  const checked = [];
  const toCheck = [hash];
  while(toCheck.length) {
    const dep = graph.allDependencies[toCheck.shift()];
    if (!dep || dep.status !== DependencyStatus.READY) {
      return false;
    }
    toCheck.push(...difference(dep.importedDependencyHashes, checked));
    checked.push(...dep.importedDependencyHashes);
  }
  return true;
});