"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common_1 = require("aerial-common");
var ContentEditorFactoryProvider = (function (_super) {
    __extends(ContentEditorFactoryProvider, _super);
    function ContentEditorFactoryProvider(mimeType, clazz, autoSave) {
        if (autoSave === void 0) { autoSave = false; }
        var _this = _super.call(this, ContentEditorFactoryProvider.getNamespace(mimeType), clazz) || this;
        _this.mimeType = mimeType;
        _this.clazz = clazz;
        _this.autoSave = autoSave;
        return _this;
    }
    ContentEditorFactoryProvider.prototype.clone = function () {
        return new ContentEditorFactoryProvider(this.mimeType, this.clazz, this.autoSave);
    };
    ContentEditorFactoryProvider.getNamespace = function (mimeType) {
        return [ContentEditorFactoryProvider.NS, mimeType].join("/");
    };
    ContentEditorFactoryProvider.prototype.create = function (uri, content) {
        return _super.prototype.create.call(this, uri, content);
    };
    ContentEditorFactoryProvider.find = function (mimeType, kernel) {
        return kernel.query(this.getNamespace(mimeType));
    };
    return ContentEditorFactoryProvider;
}(aerial_common_1.ClassFactoryProvider));
ContentEditorFactoryProvider.NS = "contentEditors";
exports.ContentEditorFactoryProvider = ContentEditorFactoryProvider;
// DEPRECATED - use URIProtocolProvider instead
var ProtocolURLResolverProvider = (function (_super) {
    __extends(ProtocolURLResolverProvider, _super);
    function ProtocolURLResolverProvider(name, clazz) {
        var _this = _super.call(this, ProtocolURLResolverProvider.getId(name), clazz) || this;
        _this.name = name;
        _this.clazz = clazz;
        return _this;
    }
    ProtocolURLResolverProvider.prototype.clone = function () {
        return new ProtocolURLResolverProvider(this.name, this.clazz);
    };
    ProtocolURLResolverProvider.prototype.create = function () {
        return _super.prototype.create.call(this);
    };
    ProtocolURLResolverProvider.getId = function (name) {
        return [this.NS, name].join("/");
    };
    ProtocolURLResolverProvider.find = function (url, kernel) {
        var provider = kernel.query(this.getId(url.split(":").shift()));
        return provider;
    };
    ProtocolURLResolverProvider.resolve = function (url, kernel) {
        var provider = this.find(url, kernel);
        return (provider && provider.create().resolve(url)) || url;
    };
    return ProtocolURLResolverProvider;
}(aerial_common_1.ClassFactoryProvider));
ProtocolURLResolverProvider.NS = "protocolReader";
exports.ProtocolURLResolverProvider = ProtocolURLResolverProvider;
// export const FileSystemProvider  = createSingletonProviderClass<IFileSystem>("fileSystem");
// export const FileResolverProvider  = createSingletonProviderClass<IFileResolver>("fileResolver");
exports.FileCacheProvider = aerial_common_1.createSingletonProviderClass("fileCache");
exports.FileEditorProvider = aerial_common_1.createSingletonProviderClass("fileEditor");
// TODO - this needs to be a singleton based on a given strategy (webpack, systemjs, rollup)
// export const DependencyGraphProvider    = createSingletonProviderClass<DependencyGraph>("bundler");
//# sourceMappingURL=providers.js.map