import { BaseApplicationState } from "aerial-common2";
import { BundleInfo } from "../../common/state"

export type GetEntryIndexHTMLOptions = {
  entryName: string;
  filePath: string;
};

export type DevConfig = {
  sourceFilePattern: string,
  webpackConfigPath?: string,
  getEntryIndexHTML: (options: GetEntryIndexHTMLOptions) => string;
};

export type ApplicationState = {
  config: DevConfig;
  bundleInfo?: BundleInfo;
} & BaseApplicationState;

export const updateApplicationState = (state: ApplicationState, properties: Partial<ApplicationState>) => ({
  ...state,
  ...properties
});

export const setBundleInfo = (state: ApplicationState, bundleInfo: BundleInfo) => updateApplicationState(state, { bundleInfo })

export * from "../../common/state";