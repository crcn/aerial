"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var remote_browser_1 = require("./remote-browser");
var common_1 = require("@tandem/common");
function createSyntheticBrowserWorkerProviders() {
    return [
        new common_1.ApplicationServiceProvider("remoteBrowserRenderer", remote_browser_1.RemoteBrowserService)
    ];
}
exports.createSyntheticBrowserWorkerProviders = createSyntheticBrowserWorkerProviders;
__export(require("./dom"));
__export(require("./browser"));
__export(require("./renderers"));
__export(require("./providers"));
__export(require("./sandbox"));
__export(require("./location"));
__export(require("./messages"));
__export(require("./remote-browser"));
//# sourceMappingURL=index.js.map