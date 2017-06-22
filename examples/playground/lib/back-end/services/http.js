"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const base_1 = require("./base");
const messages_1 = require("../messages");
const aerial_common_1 = require("aerial-common");
// TODO - dispatch incomming HTTP requests globally
let HTTPService = class HTTPService extends base_1.BaseBackEndService {
    [aerial_common_1.LoadApplicationRequest.LOAD]() {
        this._server = express();
        const { port } = this.config.http;
        this.bus.dispatch(new messages_1.HTTPServerLoadedEvent(this._server, this._server.listen(port)));
        this.logger.info(`HTTP server listening on port *${port}*`);
    }
};
HTTPService = __decorate([
    aerial_common_1.loggable()
], HTTPService);
exports.HTTPService = HTTPService;
//# sourceMappingURL=http.js.map