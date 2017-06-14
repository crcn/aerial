"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sourcePositionEquals(a, b) {
    return (a == null && b == null) || (a && b && (a.line === b.line && a.column === b.column));
}
exports.sourcePositionEquals = sourcePositionEquals;
function cloneSourcePosition(_a) {
    var line = _a.line, column = _a.column;
    return { line: line, column: column };
}
exports.cloneSourcePosition = cloneSourcePosition;
function cloneSourceLocation(_a) {
    var start = _a.start, end = _a.end;
    return {
        start: cloneSourcePosition(start),
        end: cloneSourcePosition(end)
    };
}
exports.cloneSourceLocation = cloneSourceLocation;
var noSource = {
    content: ""
};
var BaseExpression = (function () {
    function BaseExpression(location) {
        this.location = location;
    }
    BaseExpression.prototype.inRange = function (selection) {
        // const offset = this.offset;
        // const start = this.position.start + offset;
        // const end   = this.position.end + offset;
        // return (selection.start >= start && selection.start <= end) ||
        // (selection.end   >= start && selection.end <= end) ||
        // (selection.start <= start && selection.end >= end);
    };
    return BaseExpression;
}());
exports.BaseExpression = BaseExpression;
//# sourceMappingURL=base.js.map