import { BaseEvent, Action } from "aerial-common2";
import { BundleEntryInfo, BundleInfo } from "../state";

export const BUNDLE_INFO_CHANGED = "BUNDLE_INFO_CHANGED";
export const FILE_ADDED = "FILE_ADDED";
export const FILE_REMOVED = "FILE_REMOVED";
export const FILE_CHANGED = "FILE_CHANGED";

export type FileAction = {
  filePath: string;
} & Action;

export type FileChanged = {
  mtime: Date;
} & FileAction;

export type BundleInfoChanged = {
  info: BundleInfo;
} & BaseEvent;

export const isPublicAction = (action) => action["$public"];
export const publicActionFactory = <TFunc extends Function>(factory: TFunc): TFunc => ((...args) => ({
  ...factory(...args),
  $public: true
})) as any;

export const bundleInfoChanged = publicActionFactory((info: BundleInfo): BundleInfoChanged => ({
  info,
  type: BUNDLE_INFO_CHANGED
}));


export const fileChanged = publicActionFactory((filePath: string, mtime: Date): FileChanged => ({
  filePath,
  mtime,
  type: FILE_CHANGED
}));

export const fileAdded = publicActionFactory((filePath: string) => ({
  filePath,
  type: FILE_ADDED
}));

export const fileRemoved = publicActionFactory((filePath: string) => ({
  filePath,
  type: FILE_REMOVED
}));