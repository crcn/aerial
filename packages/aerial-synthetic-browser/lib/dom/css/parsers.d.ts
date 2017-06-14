/// <reference types="source-map" />
import postcss = require("postcss");
import { RawSourceMap } from "source-map";
export declare function parseCSS(source: string, map?: RawSourceMap, syntax?: any, useCache?: boolean): postcss.Root;
