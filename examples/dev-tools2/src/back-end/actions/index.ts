import { BaseEvent, Mutation, Action } from "aerial-common2";
import { Express } from "express";
import { BundleInfo } from "../state";
import { publicActionFactory, FileAction } from "../../common"

export const APPLICATION_STARTED = "APPLICATION_STARTED";
export const FILE_CONTENT_MUTATED = "FILE_CONTENT_MUTATED";
export const EXPRESS_SERVER_STARTED = "EXPRESS_SERVER_STARTED";
export const BUNDLED = "BUNDLED";

export const MUTATE_SOURCE_CONTENT = "MUTATE_SOURCE_CONTENT";

export type MutateSourceContentRequest = {
  mutations: Mutation<any>[];
} & FileAction;

export type Bundled = {
  stats: any;
} & BaseEvent;

export type ExpressServerStarted = {
  expressServer: Express
} & BaseEvent;

export type FileContentMutated = {
  filePath: string;
  mtime: Date;
  content: string;
} & BaseEvent;

export const applicationStarted = () => ({ 
  type: APPLICATION_STARTED
});

export const fileContentMutated = (filePath: string, content: string, mtime: Date): FileContentMutated => ({
  filePath,
  content,
  mtime,
  type: FILE_CONTENT_MUTATED
});

export const expressServerStarted = (expressServer: Express) => ({
  expressServer,
  type: EXPRESS_SERVER_STARTED
});


export const bundled = (stats): Bundled => ({
  stats,
  type: BUNDLED
});

export const fileAction = (filePath: string, action: any) => ({ ...action, filePath });

export * from "../../common/actions";