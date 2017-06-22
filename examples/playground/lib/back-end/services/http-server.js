"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const aerial_common_1 = require("aerial-common");
let HTTPService = class HTTPService extends base_1.BaseBackEndService {
    [aerial_common_1.LoadApplicationRequest.LOAD]() {
        console.log('LOGGGG');
    }
};
HTTPService = __decorate([
    aerial_common_1.loggable()
], HTTPService);
exports.HTTPService = HTTPService;
//# sourceMappingURL=http-server.js.map