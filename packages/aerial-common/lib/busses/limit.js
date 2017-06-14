"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mesh_1 = require("mesh");
// TODO - remove me - use LimitBus from mesh instead
var LimitBus = (function () {
    function LimitBus(max, actor) {
        this.max = max;
        this.actor = actor;
        this._queue = [];
        this._running = 0;
    }
    LimitBus.prototype.dispatch = function (message) {
        var _this = this;
        return new mesh_1.DuplexStream(function (input, output) {
            if (_this._running > _this.max) {
                _this._queue.push({ message: message, input: input, output: output });
                return;
            }
            _this._running++;
            var complete = function () {
                _this._running--;
                if (_this._queue.length) {
                    var _a = _this._queue.shift(), message_1 = _a.message, input_1 = _a.input, output_1 = _a.output;
                    input_1.pipeThrough(_this.dispatch(message_1)).pipeTo(output_1);
                }
            };
            input.pipeThrough(_this.actor.dispatch(message)).pipeTo(output).then(complete, complete);
        });
    };
    return LimitBus;
}());
exports.LimitBus = LimitBus;
//# sourceMappingURL=limit.js.map