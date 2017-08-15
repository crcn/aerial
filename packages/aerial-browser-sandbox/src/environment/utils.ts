import { hasURIProtocol } from "aerial-sandbox2";
import path = require("path");
import Url = require("url");

const joinPath = (...parts: string[]) => parts.reduce((a, b) => {
  return a + (b.charAt(0) === "/" || a.charAt(a.length - 1) === "/" ? b : "/" + b);
});

export const getUri = (href: string, locationStr: string) => {
  const location = Url.parse(locationStr);
  const origin = location.protocol + "//" + location.host;

  const relativeDir = /.\w+$/.test(location.pathname) ? path.dirname(location.pathname) : location.pathname;
  return hasURIProtocol(href) ? href : /^\/\//.test(href) ? location.protocol + href : href.charAt(0) === "/" ? joinPath(origin, href) : joinPath(origin, relativeDir, href);
};