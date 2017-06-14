/// <reference types="source-map" />
import sm = require("source-map");
import postcss = require("postcss");
import { SandboxModule } from "aerial-sandbox";
import { SyntheticCSSStyleSheet } from "./style-sheet";
export declare function evaluateCSSSource(source: string, map?: sm.RawSourceMap, module?: SandboxModule): any;
export declare function evaluateCSS(expression: postcss.Root, map?: sm.RawSourceMap, module?: SandboxModule): SyntheticCSSStyleSheet;
