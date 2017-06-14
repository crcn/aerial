"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var serialize_1 = require("../serialize");
var BoundingRect = BoundingRect_1 = (function () {
    function BoundingRect(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    Object.defineProperty(BoundingRect.prototype, "position", {
        get: function () {
            return {
                left: this.left,
                top: this.top
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundingRect.prototype, "width", {
        get: function () {
            return Math.max(this.right - this.left, 0);
        },
        set: function (value) {
            this.right = this.left + value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundingRect.prototype, "height", {
        get: function () {
            return Math.max(this.bottom - this.top, 0);
        },
        set: function (value) {
            this.bottom = this.top + value;
        },
        enumerable: true,
        configurable: true
    });
    BoundingRect.prototype.zoom = function (delta) {
        return new BoundingRect_1(this.left * delta, this.top * delta, this.right * delta, this.bottom * delta);
    };
    BoundingRect.prototype.equalTo = function (rect) {
        return (this.left === rect.left &&
            this.top === rect.top &&
            this.right === rect.right &&
            this.bottom === rect.bottom);
    };
    Object.defineProperty(BoundingRect.prototype, "visible", {
        get: function () {
            return this.width > 0 && this.height > 0;
        },
        enumerable: true,
        configurable: true
    });
    BoundingRect.prototype.toArray = function () {
        return [this.left, this.top, this.right, this.bottom];
    };
    BoundingRect.prototype.intersects = function () {
        var _this = this;
        var rects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rects[_i] = arguments[_i];
        }
        return !!rects.find(function (rect) { return (_this.intersectsHorizontal(rect) &&
            _this.intersectsVertical(rect)); });
    };
    BoundingRect.prototype.intersectsHorizontal = function () {
        var _this = this;
        var rects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rects[_i] = arguments[_i];
        }
        return !!rects.find(function (rect) { return (Math.max(_this.top, rect.top) <= Math.min(_this.bottom, rect.bottom)); });
    };
    BoundingRect.prototype.intersectsVertical = function () {
        var _this = this;
        var rects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rects[_i] = arguments[_i];
        }
        return !!rects.find(function (rect) { return (Math.max(_this.left, rect.left) <= Math.min(_this.right, rect.right)); });
    };
    BoundingRect.prototype.merge = function () {
        var rects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rects[_i] = arguments[_i];
        }
        return BoundingRect_1.merge.apply(BoundingRect_1, [this].concat(rects));
    };
    BoundingRect.prototype.move = function (_a) {
        var left = _a.left, top = _a.top;
        return new BoundingRect_1(this.left + left, this.top + top, this.right + left, this.bottom + top);
    };
    BoundingRect.prototype.moveTo = function (_a) {
        var left = _a.left, top = _a.top;
        return new BoundingRect_1(left, top, left + this.width, top + this.height);
    };
    BoundingRect.prototype.clone = function () {
        return new BoundingRect_1(this.left, this.top, this.right, this.bottom);
    };
    BoundingRect.fromClientRect = function (rect) {
        return new BoundingRect_1(rect.left, rect.top, rect.right, rect.bottom);
    };
    BoundingRect.zeros = function () {
        return new BoundingRect_1(0, 0, 0, 0);
    };
    BoundingRect.merge = function () {
        var rects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rects[_i] = arguments[_i];
        }
        var left = Infinity;
        var bottom = -Infinity;
        var top = Infinity;
        var right = -Infinity;
        for (var _a = 0, rects_1 = rects; _a < rects_1.length; _a++) {
            var rect = rects_1[_a];
            left = Math.min(left, rect.left);
            right = Math.max(right, rect.right);
            top = Math.min(top, rect.top);
            bottom = Math.max(bottom, rect.bottom);
        }
        return new BoundingRect_1(left, top, right, bottom);
    };
    return BoundingRect;
}());
BoundingRect = BoundingRect_1 = __decorate([
    serialize_1.serializable("BoundingRect", {
        serialize: function (_a) {
            var left = _a.left, top = _a.top, right = _a.right, bottom = _a.bottom;
            return [left, top, right, bottom];
        },
        deserialize: function (_a) {
            var left = _a[0], top = _a[1], right = _a[2], bottom = _a[3];
            return new BoundingRect_1(left, top, right, bottom);
        }
    })
], BoundingRect);
exports.BoundingRect = BoundingRect;
var BoundingRect_1;
//# sourceMappingURL=bounding-rect.js.map