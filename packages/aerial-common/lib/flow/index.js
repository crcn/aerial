"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = (function () {
    function Queue() {
        this._items = [];
    }
    Queue.prototype.add = function (callback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._items.push([resolve, reject, callback]);
            if (_this._running)
                return;
            _this._running = true;
            var next = function () {
                if (!_this._items.length) {
                    _this._running = false;
                    return;
                }
                var _a = _this._items.shift(), resolve = _a[0], reject = _a[1], callback = _a[2];
                var complete = function (err) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (err != null) {
                        reject();
                    }
                    else {
                        resolve.apply(void 0, rest);
                    }
                    next();
                };
                callback().then(complete.bind(_this, undefined), complete);
            };
            next();
        });
    };
    return Queue;
}());
exports.Queue = Queue;
//# sourceMappingURL=index.js.map