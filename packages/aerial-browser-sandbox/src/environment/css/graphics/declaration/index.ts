const { parse } =  require("./parser.peg");
export { parse as parseCSSDeclValue };
export * from "./ast";
export * from "./evaluate";