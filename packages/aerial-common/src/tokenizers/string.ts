import { Token } from "./token";
import { StringScanner } from "../string/scanner";
import { TokenTypes } from "./constants";

export class StringTokenizer {

  tokenize(source) {

    const scanner = new StringScanner(source);
    const tokens  = [];

    function addToken(scanRegexp, type) {
      if (scanner.scan(scanRegexp)) {
        tokens.push(new Token(scanner.getCapture(), type));
        return true;
      }
      return false;
    }

    while (!scanner.hasTerminated()) {
      if (addToken(/^[\n\r]/, TokenTypes.NEW_LINE)) continue;
      if (addToken(/^\t+/, TokenTypes.TAB)) continue;
      if (addToken(/^\u0020+/, TokenTypes.SPACE)) continue;
      if (addToken(/[^\s\t\n\r]+/, TokenTypes.TEXT)) continue;
      throw new Error("unexpected token: " + scanner.getCapture());
    }

    return tokens;
  }
}

export const stringTokenizer = new StringTokenizer();
