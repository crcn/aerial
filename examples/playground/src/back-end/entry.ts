import { noop } from "lodash";
import { resolve } from "path";
import { readAll } from "mesh";
import { initApplication } from "./index";
import { createImmutableObject, immutable, LogLevel, logInfoAction } from "aerial-common2";

// // TODO - point to browser prop on package.json
const FRONT_END_CSS_PATH = resolve(__dirname, "..", "front-end", "entry.bundle.css");
const FRONT_END_ENTRY_PATH = resolve(__dirname, "..", "front-end", "entry.bundle.js");

initApplication({
  http: {
    port: 8080
  },
  frontEnd: {
    entryPath: FRONT_END_ENTRY_PATH,
    cssPath: FRONT_END_CSS_PATH
  },
  log: {
    level: LogLevel.VERBOSE
  }
});
