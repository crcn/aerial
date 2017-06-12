import { ENV_IS_NODE } from "@tandem/common/utils";
export * from "./browser";
module.exports = typeof window === "undefined" ? require("./node") : require("./browser");
