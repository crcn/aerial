"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common_1 = require("aerial-common");
var messages_1 = require("./messages");
var commands_1 = require("./commands");
exports.createCommandProviders = function () {
    return [
        new aerial_common_1.CommandFactoryProvider(messages_1.ReadFileRequest.READ_FILE, commands_1.ReadFileCommand),
        new aerial_common_1.CommandFactoryProvider(messages_1.WriteFileRequest.WRITE_FILE, commands_1.WriteFileCommand),
        new aerial_common_1.CommandFactoryProvider(messages_1.UpdateFileCacheRequest.UPDATE_FILE_CACHE, commands_1.UpdateFileCacheCommand)
    ];
};
__export(require("./providers"));
__export(require("./messages"));
__export(require("./synthetic"));
__export(require("./file-system"));
__export(require("./resolver"));
__export(require("./dependency-graph"));
__export(require("./file-cache"));
__export(require("./sandbox"));
__export(require("./edit"));
__export(require("./core"));
__export(require("./uri"));
__export(require("./commands"));
//# sourceMappingURL=index.js.map