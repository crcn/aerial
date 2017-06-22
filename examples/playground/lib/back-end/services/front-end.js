"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const messages_1 = require("../messages");
const express = require("express");
const path = require("path");
const aerial_common_1 = require("aerial-common");
let FrontEndService = class FrontEndService extends base_1.BaseBackEndService {
    [messages_1.HTTPServerLoadedEvent.HTTP_SERVER_LOADED]({ expressServer }) {
        const frontEndEntryBasename = path.basename(this.config.frontEnd.entryPath);
        // TODO - move this to global handler
        expressServer.all("/index.html", (req, res) => {
            res.send(`
        <html>
          <head>
          </head>
          <body>
            <div id="application"></div>
            <script type="text/javascript" src="./${frontEndEntryBasename}"></script>
          </body>
        </html>
      `);
        });
        expressServer.use(express.static(path.dirname(this.config.frontEnd.entryPath)));
    }
};
FrontEndService = __decorate([
    aerial_common_1.loggable()
], FrontEndService);
exports.FrontEndService = FrontEndService;
//# sourceMappingURL=front-end.js.map