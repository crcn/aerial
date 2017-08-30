
export const BUNDLE_INFO_CHANGED = "BUNDLE_INFO_CHANGED";
import { BundleEntryInfo, BundleInfo } from "../state";
import { BaseEvent } from "aerial-common2";

export const isPublicAction = (action) => action["$public"];
export const publicActionFactory = <TFunc extends Function>(factory: TFunc): TFunc => ((...args) => ({
  ...factory(...args),
  $public: true
})) as any;

export type BundleInfoChanged = {
  info: BundleInfo;
} & BaseEvent;

export const bundleInfoChanged = publicActionFactory((info: BundleInfo): BundleInfoChanged => ({
  info,
  type: BUNDLE_INFO_CHANGED
}));
