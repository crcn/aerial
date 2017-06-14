import { ENV_IS_NODE } from "../utils";
export * from "./browser";
module.exports = typeof window === "undefined" ? require("./node") : require("./browser");
