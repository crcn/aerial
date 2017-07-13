import { noop } from "lodash";
import { resolve } from "path";
import { readAll } from "mesh";
import { LogLevel } from "aerial-common2";
import { bootstrapBackend, createRootState } from "./index";

// // TODO - point to browser prop on package.json
const FRONT_END_ENTRY_PATH = resolve(__dirname, "..", "front-end", "entry.bundle.js");

const dispatch = bootstrapBackend({
  http: {
    port: Number(process.env.PORT || 8080)
  },
  frontEnd: {
    entryPath: FRONT_END_ENTRY_PATH
  },
  log: {
    level: LogLevel.VERBOSE
  }
}, createRootState())(noop);

readAll(dispatch({
  type: "DO SOMETHING"
})).then(() => {
  console.log('RUNNING');
})
