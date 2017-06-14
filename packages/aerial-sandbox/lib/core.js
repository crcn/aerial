"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var edit_1 = require("./edit");
var dependency_graph_1 = require("./dependency-graph");
var file_system_1 = require("./file-system");
var file_cache_1 = require("./file-cache");
var dependency_graph_2 = require("./dependency-graph");
var providers_1 = require("./providers");
var uri_1 = require("./uri");
function createSandboxProviders(fileResoverClass) {
    return [
        // new FileSystemProvider(fileSystemClass || (ENV_IS_NODE ?  LocalFileSystem : RemoteFileSystem)),
        // new FileResolverProvider(fileResoverClass || (ENV_IS_NODE ? LocalFileResolver : RemoteFileResolver)),
        new providers_1.FileCacheProvider(file_cache_1.FileCache),
        new uri_1.URIProtocolProvider("data", uri_1.DataURIProtocol),
        new uri_1.URIProtocolProvider("file", file_system_1.FileURIProtocol),
        new uri_1.URIProtocolProvider("http", uri_1.HTTPURIProtocol),
        new uri_1.URIProtocolProvider("https", uri_1.HTTPURIProtocol),
        new uri_1.URIProtocolProvider("cache", file_cache_1.FileCacheProtocol),
        new providers_1.FileEditorProvider(edit_1.FileEditor),
        new dependency_graph_2.DependencyGraphProvider(dependency_graph_1.DependencyGraph)
    ];
}
exports.createSandboxProviders = createSandboxProviders;
//# sourceMappingURL=core.js.map