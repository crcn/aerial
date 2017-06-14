"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TreeWalker = (function () {
    function TreeWalker(each) {
        this.each = each;
    }
    TreeWalker.prototype.accept = function (visitor) {
        if (!this._stopped && this.each(visitor) !== false) {
            visitor.visitWalker(this);
        }
        else {
            this._stopped = true;
        }
    };
    return TreeWalker;
}());
exports.TreeWalker = TreeWalker;
//# sourceMappingURL=walker.js.map