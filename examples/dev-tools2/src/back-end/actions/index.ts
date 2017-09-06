import { BaseEvent, Mutation, Action } from "aerial-common2";
import { Express } from "express";
import { BundleInfo } from "../state";
import { publicActionFactory } from "../../common"

export const APPLICATION_STARTED = "APPLICATION_STARTED";
export const FILE_CONTENT_MUTATED = "FILE_CONTENT_MUTATED";
export const EXPRESS_SERVER_STARTED = "EXPRESS_SERVER_STARTED";
export const FILE_ADDED = "FILE_ADDED";
export const FILE_REMOVED = "FILE_REMOVED";
export const FILE_CHANGED = "FILE_CHANGED";
export const BUNDLED = "BUNDLED";

export const MUTATE_SOURCE_CONTENT = "MUTATE_SOURCE_CONTENT";

export type FileAction = {
  filePath: string;
} & Action;

export type MutateSourceContentRequest = {
  mutations: Mutation<any>[];
} & FileAction;

export type FileEvent = {
  path: string;
} & BaseEvent;

export type Bundled = {
  stats: any;
} & BaseEvent;

export type ExpressServerStarted = {
  expressServer: Express
} & BaseEvent;

export type FileContentMutated = {
  filePath: string;
  content: string;
} & BaseEvent;

export const applicationStarted = () => ({ 
  type: APPLICATION_STARTED
});

export const fileContentMutated = (filePath: string, content: string) => ({
  filePath,
  content,
  type: FILE_CONTENT_MUTATED
});

export const expressServerStarted = (expressServer: Express) => ({
  expressServer,
  type: EXPRESS_SERVER_STARTED
});

export const fileChanged = (path: string) => ({
  path,
  type: FILE_CHANGED
});

export const fileAdded = (path: string) => ({
  path,
  type: FILE_ADDED
});

export const fileRemoved = (path: string) => ({
  path,
  type: FILE_REMOVED
});

export const bundled = (stats): Bundled => ({
  stats,
  type: BUNDLED
});

export const fileAction = (filePath: string, action: any) => ({ ...action, filePath });

export * from "../../common/actions";