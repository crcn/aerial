import { BaseEvent, Dispatcher } from "aerial-common2";
import { Workspace } from "front-end/state";
import { SyntheticBrowser } from "aerial-synthetic-browser";

/**
 * Event types
 */

export const SYNTHETIC_BROWSER_STARTED = "SYNTHETIC_BROWSER_STARTED";

/**
 * Event state
 */

export type SyntheticBrowserStartedEvent = {
  browser: SyntheticBrowser,
  workspace: Workspace
} & BaseEvent;

/**
 * Event factories
 */

export const syntheticBrowserStarted = (workspace: Workspace, browser: SyntheticBrowser) => ({
  type: SYNTHETIC_BROWSER_STARTED,
  browser,
  workspace
});

/**
 * Dispatchers
 */

// export const initWorkspaceService = (upstream)