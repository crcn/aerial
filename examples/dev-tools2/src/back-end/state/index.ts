import { BaseApplicationState } from "aerial-common2";

export type GetEntryIndexHTMLOptions = {
  entryName: string;
  filePath: string;
};

export type DevConfig = {
  sourceFilePattern: string,
  webpackConfigPath?: string,
  getEntryIndexHTML: (options: GetEntryIndexHTMLOptions) => string;
}

export type ApplicationState = {
  config: DevConfig
} & BaseApplicationState;

