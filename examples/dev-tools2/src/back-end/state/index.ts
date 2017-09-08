import { BaseApplicationState, Mutation, StringMutation } from "aerial-common2";
import { BundleInfo } from "../../common/state"

export type GetEntryIndexHTMLOptions = {
  entryName: string;
  filePath: string;
};

export type FileCache = {
  [identifier: string]: {
    content: string;
    mtime: Date;
  }
}

export type DevConfig = {
  port: number;
  sourceFilePattern: string;
  webpackConfigPath?: string;
  getEntryIndexHTML: (options: GetEntryIndexHTMLOptions) => string;
  editSourceContent?(content: string, mutation: Mutation<any>, filePath?: string): StringMutation|StringMutation[];
};

export type ApplicationState = {
  config: DevConfig;
  bundleInfo?: BundleInfo;
  fileCache: FileCache;
} & BaseApplicationState;

export const updateApplicationState = (state: ApplicationState, properties: Partial<ApplicationState>) => ({
  ...state,
  ...properties
});

export const setBundleInfo = (state: ApplicationState, bundleInfo: BundleInfo) => updateApplicationState(state, { bundleInfo })

export const getFileCacheContent = (path: string, state: ApplicationState) => state.fileCache[path] && state.fileCache[path].content;

export const getFileCacheItem = (path: string, state: ApplicationState) => state.fileCache[path] && state.fileCache[path];

export const setFileCacheContent = (state: ApplicationState, path: string, content: string, mtime: Date = new Date()) => updateApplicationState(state, {
  fileCache: {
    ...state.fileCache,
    [path]: {
      content,
      mtime,
    }
  }
});

export const removeFileCache = (state: ApplicationState, path: string): ApplicationState => updateApplicationState(state, {
  fileCache: {
    ...state.fileCache,
    [path]: undefined
  }
});

export * from "../../common/state";