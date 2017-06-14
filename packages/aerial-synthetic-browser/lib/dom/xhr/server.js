"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_sandbox_1 = require("aerial-sandbox");
var mesh_1 = require("mesh");
var aerial_common_1 = require("aerial-common");
var messages_1 = require("./messages");
var XHRServer = (function () {
    function XHRServer(window) {
    }
    XHRServer.prototype.dispatch = function (request) {
        var _this = this;
        if (request.type !== messages_1.HTTPRequest.HTTP_REQUEST)
            return;
        return new mesh_1.DuplexStream(function (input, output) {
            var writer = output.getWriter();
            _this.logger.info("XHR " + request.method + " " + request.url);
            aerial_sandbox_1.URIProtocolProvider.lookup(request.url, _this._kernel).read(request.url).catch(function (e) {
                writer.abort(e);
            }).then(function (data) {
                var response = new messages_1.HTTPResponse(data ? messages_1.HTTPStatusType.OK : messages_1.HTTPStatusType.INTERNAL_SERVER_ERROR, {
                    contentType: data && data.type || "text/plain"
                });
                writer.write(response);
                writer.write(String(data && data.content));
                writer.close();
            });
        });
    };
    __decorate([
        aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
    ], XHRServer.prototype, "_kernel", void 0);
    XHRServer = __decorate([
        aerial_common_1.loggable()
    ], XHRServer);
    return XHRServer;
}());
exports.XHRServer = XHRServer;
//# sourceMappingURL=server.js.map