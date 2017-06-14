"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BubbleDispatcher = (function () {
    function BubbleDispatcher(target) {
        this.target = target;
    }
    BubbleDispatcher.prototype.dispatch = function (event) {
        this.target.notify(event);
    };
    return BubbleDispatcher;
}());
exports.BubbleDispatcher = BubbleDispatcher;
//# sourceMappingURL=bubble.js.map