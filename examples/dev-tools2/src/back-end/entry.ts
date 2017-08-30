import { initApplication } from "./index";
import { LogLevel } from "aerial-common2";
import { argv } from "yargs";
import * as path from "path";
import { applicationStarted } from "./actions";

const configPath = path.join(process.cwd(), "dev-tools.config");

// TODO - check for existence

initApplication({
  config: require(configPath),
  log: {
    level: LogLevel.ALL
  }
}).dispatch(applicationStarted());
