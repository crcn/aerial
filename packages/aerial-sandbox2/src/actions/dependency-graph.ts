import { ResolvedDependencyInfo, LoadedDependencyContentResult, Dependency } from "../state";
import { Request, BaseEvent, Response, generateDefaultId } from "aerial-common2";

/**
 * Types
 */

export const LOAD_DEPENDENCY    = "LOAD_DEPENDENCY";
export const LOAD_DEPENDENCY_CONTENT = "LOAD_DEPENDENCY_CONTENT";
export const DEPENDENCY_CONTENT_LOADED = "DEPENDENCY_CONTENT_LOADED";
export const RESOLVE_DEPENDENCY = "RESOLVE_DEPENDENCY";
export const ADD_DEPENDENCY     = "ADD_DEPENDENCY";
export const DEPENDENCY_CREATED = "DEPENDENCY_CREATED";
export const DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT = "DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT";
export const DEPENDENCY_CHILDREN_ADDED = "DEPENDENCY_CHILDREN_ADDED";

/**
 * Structs
 */

export type LoadDependencyRequest = {
  uri: string
} & Request;

export type AddDependencyRequest = {
  uri: string;
  originUri: string;
} & Request;

export type AddDependencyResponse = Response<Dependency>;

export type ResolveDependencyRequest = {
  uri: string;
  originUri?: string;
} & Request;

export type DependencyCreatedEvent = {
  info: ResolvedDependencyInfo;
} & BaseEvent;

export type LoadDependencyContentRequest = {
  dependency: Dependency;
  content: string|Buffer;
  contentType: string;
  options: any;
} & Request;

export type DefaultGraphStrategyLoadContentRequest = {
  dependency: Dependency;
  content: string|Buffer;
  contentType: string;
} & Request;

export type DependencyChildrenAddedEvent = {
  dependencyId: string;
  importedDependencyHashes: string[]
} & BaseEvent;

export type ResolveDependencyResponse = Response<ResolvedDependencyInfo>;
export type LoadedDependencyContentResponse = Response<LoadedDependencyContentResult>;

export type DependencyContentLoadedEvent = {
  dependencyId: string;
  result: LoadedDependencyContentResult;
} & BaseEvent;
/**
 * Factories
 */

export const createLoadDependencyRequest = (uri: string): LoadDependencyRequest => ({
  uri,
  type: LOAD_DEPENDENCY,
  $$id: generateDefaultId()
});

export const createAddDependencyRequest = (uri: string, originUri?: string): AddDependencyRequest => ({
  uri,
  originUri,
  type: ADD_DEPENDENCY,
  $$id: generateDefaultId()
});

export const createDependencyCreatedEvent = (info: ResolvedDependencyInfo): DependencyCreatedEvent => ({
  info,
  type: DEPENDENCY_CREATED,
});

export const createResolveDependencyRequest = (uri: string, originUri?: string): ResolveDependencyRequest => ({
  uri,
  originUri,
  type: RESOLVE_DEPENDENCY,
  $$id: generateDefaultId()
});

export const createLoadDependencyContentRequest = (dependency: Dependency, content: string|Buffer, contentType: string, options: any): LoadDependencyContentRequest => ({
  dependency,
  content,
  options,
  contentType,
  type: LOAD_DEPENDENCY_CONTENT,
  $$id: generateDefaultId()
});

export const createDependencyContentLoadedEvent = (dependencyId: string, result: LoadedDependencyContentResult): DependencyContentLoadedEvent => ({
  dependencyId,
  result,
  type: DEPENDENCY_CONTENT_LOADED
});

export const createDependencyChildrenAddedEvent = (dependencyId: string, importedDependencyHashes: string[]): DependencyChildrenAddedEvent => ({
  dependencyId,
  importedDependencyHashes,
  type: DEPENDENCY_CHILDREN_ADDED
});

export const createDefaultGraphStrategyLoadContentRequest = (dependency: Dependency, content: string|Buffer, contentType: string): DefaultGraphStrategyLoadContentRequest => ({
  dependency,
  content,
  contentType,
  type: DEFAULT_GRAPH_STRATEGY_LOAD_CONTENT,
  $$id: generateDefaultId()
});