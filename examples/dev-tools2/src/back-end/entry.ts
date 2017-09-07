import { initApplication } from "./index";
import { LogLevel } from "aerial-common2";
import { argv } from "yargs";
import * as path from "path";
import { applicationStarted } from "./actions";
import { VISUAL_TOOLS_CONFIG_FILE_NAME } from "./constants";

const configPath = path.join(process.cwd(), VISUAL_TOOLS_CONFIG_FILE_NAME);

// TODO - check for existence

initApplication({
  config: require(configPath),
  log: {
    level: LogLevel.ALL
  }
}).dispatch(applicationStarted());
