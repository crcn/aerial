import { noop } from "lodash";
import { Kernel } from "aerial-common";
import { LogLevel } from "aerial-common2";

import { 
  initApplication, 
  createWorkspace,
  addWorkspace,
  selectWorkspace,
  addSyntheticBrowser,
  createSyntheticBrowser,
  createApplicationState, 
} from "./index";

let state = createApplicationState({
  apiHost: `localhost:8080`,
  element: typeof document !== "undefined" ? document.getElementById("application") : undefined,
  log: {
    level: LogLevel.VERBOSE
  }
});
const browser = createSyntheticBrowser();
state = addSyntheticBrowser(state, browser);
const workspace = createWorkspace({ browserId: browser.$$id });
state = addWorkspace(state, workspace);
state = selectWorkspace(state, workspace.$$id);

initApplication(state);