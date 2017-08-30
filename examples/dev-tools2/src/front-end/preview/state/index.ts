import { BaseApplicationState } from "aerial-common2";
import { BundleEntryInfo } from "../../../common";

export type ApplicationState = {
  entryHash: string;
  entryInfo: BundleEntryInfo;
} & BaseApplicationState;
