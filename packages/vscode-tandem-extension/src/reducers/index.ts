import { ExtensionState, removeFileCache, updateExtensionState, setFileCache } from "../state";
import { VisualDevConfigLoaded, VISUAL_DEV_CONFIG_LOADED, CHILD_DEV_SERVER_STARTED, ChildDevServerStarted, FileContentChanged, FILE_CONTENT_CHANGED, FILE_CHANGED, FileAction } from "../actions";
import { Action } from "redux";

export function mainReducer(state: ExtensionState, action: Action) {
  switch(action.type) {
    case VISUAL_DEV_CONFIG_LOADED: {
      const { config } = action as VisualDevConfigLoaded;
      return updateExtensionState(state, {
        visualDevConfig: config
      });
    }
    case CHILD_DEV_SERVER_STARTED: {
      const { port } = action as ChildDevServerStarted;
      return updateExtensionState(state, {
        childDevServerInfo: { 
          port
        }
      });
    }

    case FILE_CONTENT_CHANGED: {
      const { filePath, content } = action as FileContentChanged;
      return setFileCache(state, filePath, content);
    }

    case FILE_CHANGED: {
      const { filePath } = action as FileAction;
      return removeFileCache(state, filePath);
    }
  }
  return state;
}