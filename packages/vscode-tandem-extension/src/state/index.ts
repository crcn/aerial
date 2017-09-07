export type VisualDevConfig = {
  port: number;
  editSourceContent: (content: string, mutation: any, filePath: string) => any;
  sourceFilePattern: string;
  vscode: {
    devServerScript: string[]
  };
}

export type ChildDevServerInfo = {
  port: number;
}

export type FileCache = {
  [identifer: string]: {
    content: string;
    mtime: Date;
  }
}

export type ExtensionState = {

  visualDevConfig?: VisualDevConfig;

  childDevServerInfo?: ChildDevServerInfo;

  fileCache: FileCache;

  // root project path
  rootPath: string;
};

export const updateExtensionState = (state: ExtensionState, properties: Partial<ExtensionState>) => ({
  ...state,
  ...properties
});

export const getFileCacheContent = (filePath: string, state: ExtensionState) => {
  return state.fileCache[filePath] && state.fileCache[filePath].content;
}

export const setFileCache = (state: ExtensionState, filePath: string, content: string) => {
  return updateExtensionState(state, {
    fileCache: {
      ...state.fileCache,
      [filePath]: {
        content,
        mtime: new Date()
      }
    }
  })
}

export const removeFileCache = (state: ExtensionState, filePath: string) => updateExtensionState(state, {
  fileCache: {
    ...state.fileCache,
    [filePath]: undefined
  }
})