import { noop } from "lodash";
import { Kernel } from "aerial-common";
import { LogLevel } from "aerial-common2";
import { createSyntheticBrowser } from "aerial-browser-sandbox";

import { 
  createFile,
  initApplication, 
  createWorkspace, 
  createDirectory,
  createApplicationState, 
} from "./index";

const workspace = createWorkspace({
  browser: createSyntheticBrowser()
});

initApplication(createApplicationState({
  workspaces: [workspace],
  selectedWorkspaceId: workspace.$$id,
  apiHost: `localhost:8080`,
  element: typeof document !== "undefined" ? document.getElementById("application") : undefined,
  log: {
    level: LogLevel.VERBOSE
  }
}));