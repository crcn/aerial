import { start } from "./index";
import { argv } from "yargs";
import * as path from "path";

const configPath = path.join(process.cwd(), "dev-tools.config");

// TODO - check for existence

start(require(configPath));
