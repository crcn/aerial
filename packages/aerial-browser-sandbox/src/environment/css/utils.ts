const postcss = require("postcss");

export const parseCSS = (source: string) => postcss.parseCSS(source);
