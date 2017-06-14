"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Range = (function () {
    function Range(start, end) {
        this.start = start;
        this.end = end;
    }
    Range.prototype.shift = function (delta) {
        this.start += delta;
        this.end += delta;
    };
    return Range;
}());
exports.Range = Range;
//# sourceMappingURL=range.js.map