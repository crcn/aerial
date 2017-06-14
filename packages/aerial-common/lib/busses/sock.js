"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mesh_1 = require("mesh");
// Important that the boundary is computed is to prevent the case where the boundary is part of the payload. This
// has happened with Tandem since the app is used to build itself.
var PAYLOAD_BOUNDARY = "___" + "payload end" + "___";
var SockBus = (function () {
    function SockBus(_a, localBus, serializer) {
        var family = _a.family, connection = _a.connection, testMessage = _a.testMessage;
        var _this = this;
        connection.once("close", function () {
            _this._remoteBus.dispose();
        });
        this._remoteBus = new mesh_1.RemoteBus({
            family: family,
            testMessage: testMessage,
            adapter: {
                send: function (data) {
                    connection.write("" + JSON.stringify(data) + PAYLOAD_BOUNDARY);
                },
                addListener: function (listener) {
                    var currentBuffer = '';
                    connection.on("data", function (chunk) {
                        var value = String(chunk);
                        currentBuffer += value;
                        if (currentBuffer.indexOf(PAYLOAD_BOUNDARY) !== -1) {
                            var payloadParts = currentBuffer.split(PAYLOAD_BOUNDARY);
                            var last = payloadParts.pop();
                            payloadParts.map(function (text) { return JSON.parse(text); }).forEach(listener);
                            currentBuffer = last;
                        }
                    });
                }
            }
        }, localBus, serializer);
    }
    SockBus.prototype.testMessage = function (message) {
        return this._remoteBus.testMessage(message);
    };
    SockBus.prototype.dispose = function () {
        this._remoteBus.dispose();
    };
    SockBus.prototype.dispatch = function (message) {
        return this._remoteBus.dispatch(message);
    };
    return SockBus;
}());
exports.SockBus = SockBus;
//# sourceMappingURL=sock.js.map