"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringScanner = (function () {
    function StringScanner(source) {
        this._source = source == null ? "" : String(source);
        this._position = 0;
    }
    StringScanner.prototype.scan = function (regexp) {
        var rest = this._source.substr(this._position);
        var match = rest.match(regexp);
        if (!match)
            return void 0;
        this._capture = match[0];
        this._position += rest.indexOf(this._capture) + this._capture.length;
        return this._capture;
    };
    StringScanner.prototype.nextChar = function () {
        return this._source.charAt(this._position++);
    };
    StringScanner.prototype.hasTerminated = function () {
        return this._position >= this._source.length;
    };
    StringScanner.prototype.getCapture = function () {
        return this._capture;
    };
    return StringScanner;
}());
exports.StringScanner = StringScanner;
//# sourceMappingURL=scanner.js.map