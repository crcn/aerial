import postcss =  require("postcss");

import { IRange } from "aerial-common";
import { RawSourceMap } from "source-map";


// TODO - cache source here for a bit 
export function parseCSS(source: string, map?: RawSourceMap, syntax?: any, useCache?: boolean): postcss.Root {
  return postcss().process(source, {
    syntax: syntax,
    map: map && {
      prev: map
    }
  }).root;
}