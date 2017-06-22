"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aerial_common_1 = require("aerial-common");
class HTTPServerLoadedEvent extends aerial_common_1.CoreEvent {
    constructor(expressServer, httpServer) {
        super(HTTPServerLoadedEvent.HTTP_SERVER_LOADED);
        this.expressServer = expressServer;
        this.httpServer = httpServer;
    }
}
HTTPServerLoadedEvent.HTTP_SERVER_LOADED = "httpServerLoaded";
exports.HTTPServerLoadedEvent = HTTPServerLoadedEvent;
//# sourceMappingURL=index.js.map