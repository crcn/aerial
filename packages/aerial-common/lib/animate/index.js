"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tween(start, end, duration, iterate, ease, complete) {
    if (ease === void 0) { ease = easeNone; }
    if (complete === void 0) { complete = function () { }; }
    var change = end - start;
    var startTime = Date.now();
    var fps = 1000 / 30;
    var _break = false;
    function tick() {
        if (_break)
            return;
        var currentTime = Math.min(Date.now() - startTime, duration);
        var currentValue = start + change * ease(currentTime / duration);
        iterate(currentValue);
        if (currentTime === duration) {
            return complete();
        }
        setTimeout(tick, fps);
    }
    tick();
    return {
        dispose: function () {
            _break = true;
        }
    };
}
exports.tween = tween;
function easeInCubic(t) {
    return t * t * t;
}
exports.easeInCubic = easeInCubic;
function easeNone(t) {
    return t;
}
exports.easeNone = easeNone;
function easeOutCubic(t) {
    return (--t) * t * t + 1;
}
exports.easeOutCubic = easeOutCubic;
//# sourceMappingURL=index.js.map