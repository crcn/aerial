import { noop } from "lodash";
import { resolve } from "path";
import { initApplication } from "./index";
import { createImmutableObject, immutable, LogLevel } from "aerial-common2";

// // TODO - point to browser prop on package.json
const FRONT_END_ENTRY_PATH = resolve(__dirname, "..", "front-end", "entry.bundle.js");

initApplication(immutable({
  http: {
    port: 8080
  },
  frontEnd: {
    entryPath: FRONT_END_ENTRY_PATH
  },
  log: {
    level: LogLevel.VERBOSE
  }
})).run(immutable({
  dispatch: noop
}));
