import { parse } from "./parser.peg";
import { CSSMediaQueryListExpression } from "./ast";

export const parseCSSMedia = (source: string) => parse(source);

export * from "./ast";