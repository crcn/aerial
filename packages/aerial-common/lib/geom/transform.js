"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transform = (function () {
    function Transform(left, top, scale) {
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        if (scale === void 0) { scale = 1; }
        this.left = left;
        this.top = top;
        this.scale = scale;
    }
    Transform.prototype.localizePosition = function (position) {
        return {
            left: (position.left - this.left) / this.scale,
            top: (position.top - this.top) / this.scale
        };
    };
    return Transform;
}());
exports.Transform = Transform;
//# sourceMappingURL=transform.js.map