"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var scanner_1 = require("../string/scanner");
var constants_1 = require("./constants");
var StringTokenizer = (function () {
    function StringTokenizer() {
    }
    StringTokenizer.prototype.tokenize = function (source) {
        var scanner = new scanner_1.StringScanner(source);
        var tokens = [];
        function addToken(scanRegexp, type) {
            if (scanner.scan(scanRegexp)) {
                tokens.push(new token_1.Token(scanner.getCapture(), type));
                return true;
            }
            return false;
        }
        while (!scanner.hasTerminated()) {
            if (addToken(/^[\n\r]/, constants_1.TokenTypes.NEW_LINE))
                continue;
            if (addToken(/^\t+/, constants_1.TokenTypes.TAB))
                continue;
            if (addToken(/^\u0020+/, constants_1.TokenTypes.SPACE))
                continue;
            if (addToken(/[^\s\t\n\r]+/, constants_1.TokenTypes.TEXT))
                continue;
            throw new Error("unexpected token: " + scanner.getCapture());
        }
        return tokens;
    };
    return StringTokenizer;
}());
exports.StringTokenizer = StringTokenizer;
exports.stringTokenizer = new StringTokenizer();
//# sourceMappingURL=string.js.map