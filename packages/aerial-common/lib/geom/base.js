"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bounding_rect_1 = require("./bounding-rect");
function cloneRange(range) {
    return { start: range.start, end: range.end };
}
exports.cloneRange = cloneRange;
var Point = (function () {
    function Point(left, top) {
        this.left = left;
        this.top = top;
    }
    Point.prototype.clone = function () {
        return new Point(this.left, this.top);
    };
    Point.prototype.distanceTo = function (point) {
        return Math.sqrt(Math.pow(this.left - point.left, 2) + Math.pow(this.top - point.top, 2));
    };
    return Point;
}());
exports.Point = Point;
var Line = (function () {
    function Line(from, to) {
        this.from = from;
        this.to = to;
    }
    Object.defineProperty(Line.prototype, "points", {
        get: function () {
            return [this.from, this.to];
        },
        enumerable: true,
        configurable: true
    });
    Line.prototype.flip = function () {
        return new Line(new Point(this.to.left, this.from.top), new Point(this.from.left, this.to.top));
    };
    Line.prototype.reverse = function () {
        return new Line(this.to.clone(), this.from.clone());
    };
    Object.defineProperty(Line.prototype, "length", {
        get: function () {
            return this.from.distanceTo(this.to);
        },
        enumerable: true,
        configurable: true
    });
    Line.prototype.getBoundingRect = function () {
        return new bounding_rect_1.BoundingRect(Math.min(this.from.left, this.to.left), Math.min(this.from.top, this.to.top), Math.max(this.from.left, this.to.left), Math.max(this.from.top, this.to.top));
    };
    return Line;
}());
exports.Line = Line;
//# sourceMappingURL=base.js.map