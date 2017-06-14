"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// A bit of a cluster fuck this is. Needs cleaning after many of mysteries
// around webpack are resolved.
var aerial_common_1 = require("aerial-common");
var md5 = require("md5");
var fs = require("fs");
var nodeLibs = require("node-libs-browser");
var detective = require("detective");
var resolver_1 = require("@tandem/sandbox/resolver");
var providers_1 = require("@tandem/sandbox/providers");
var path = require("path");
var resolveNodeModule = require("resolve");
function testLoader(uri, loader) {
    if (!(typeof loader.test === "function" ? loader.test(uri) : loader.test.test(uri)))
        return false;
    // more here
    return true;
}
var MockWebpackCompiler = (function () {
    function MockWebpackCompiler() {
    }
    MockWebpackCompiler.prototype.plugin = function (key, callback) { };
    return MockWebpackCompiler;
}());
exports.MockWebpackCompiler = MockWebpackCompiler;
var WebpackLoaderContextModule = (function () {
    function WebpackLoaderContextModule() {
        this.meta = {};
        this.errors = [];
    }
    return WebpackLoaderContextModule;
}());
var WebpackLoaderContext = (function () {
    function WebpackLoaderContext(loaders, loader, strategy, resourcePath, id, _dependencies) {
        this.loaders = loaders;
        this.loader = loader;
        this.strategy = strategy;
        this.resourcePath = resourcePath;
        this.id = id;
        this._dependencies = _dependencies;
        this._compiler = strategy.compiler;
        this.query = loader.query;
        this.options = Object.assign({ context: "" }, strategy.config);
        this.loaderIndex = this.loaders.indexOf(loader);
        this._module = new WebpackLoaderContextModule();
        this.remainingRequest = this.loaderIndex === this.loaders.length - 1 ? this.resourcePath : undefined;
    }
    WebpackLoaderContext.prototype.emitWarning = function () {
    };
    Object.defineProperty(WebpackLoaderContext.prototype, "includedDependencyUris", {
        get: function () {
            return this._dependencies;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebpackLoaderContext.prototype, "module", {
        get: function () {
            return require(this.loader.modulePath);
        },
        enumerable: true,
        configurable: true
    });
    WebpackLoaderContext.prototype.load = function (content, map) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._resolve = resolve;
                        _this._reject = reject;
                        var result = _this.module.call(_this, _this.module.raw ? content : String(content), map);
                        if (!_this._async) {
                            return resolve(result && { content: result });
                        }
                    })];
            });
        });
    };
    WebpackLoaderContext.prototype.capture = function () {
        var module = this.module;
        if (!module.pitch)
            return;
        var remainingRequests = this.loaders.slice(this.loaderIndex + 1).map(function (loader) {
            return loader.modulePath + (loader.query || "");
        });
        remainingRequests.push(this.resourcePath);
        var result = module.pitch(remainingRequests.join("!"));
        if (result == null)
            return;
        return { content: result, map: undefined };
    };
    WebpackLoaderContext.prototype.emitFile = function (fileName, content) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, fileCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = "webpack://" + fileName;
                        // this.addDependency(uri);
                        this.logger.debug("Emitting asset " + fileName);
                        fileCache = providers_1.FileCacheProvider.getInstance(this.strategy.kernel);
                        return [4 /*yield*/, fileCache.save(uri, { content: content })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebpackLoaderContext.prototype.async = function () {
        var _this = this;
        this._async = true;
        return function (err, content, map) {
            if (err)
                return _this._reject(err);
            // change sources to absolute path for edits
            if (map) {
                map.sources = map.sources.map(function (relativePath) {
                    return relativePath.charAt(0) !== "/" ? path.join(_this.strategy.config.context || process.cwd(), relativePath) : relativePath;
                });
            }
            _this._resolve({ content: content, map: map });
        };
    };
    WebpackLoaderContext.prototype.cacheable = function () {
    };
    WebpackLoaderContext.prototype.clearProviders = function () {
        this._dependencies = [];
    };
    WebpackLoaderContext.prototype.addDependency = function (uri) {
        this._dependencies.push(uri);
    };
    WebpackLoaderContext.prototype.dependency = function (uri) {
        return this.addDependency(uri);
    };
    WebpackLoaderContext.prototype.resolve = function (cwd, relativePath, callback) {
        this.strategy.resolve(relativePath, cwd).then(function (info) {
            callback(null, info.uri && info.uri.replace("file://", ""));
        }).catch(callback);
    };
    return WebpackLoaderContext;
}());
WebpackLoaderContext = __decorate([
    aerial_common_1.loggable()
], WebpackLoaderContext);
var WebpackDependencyLoader = (function () {
    function WebpackDependencyLoader(strategy, options) {
        this.strategy = strategy;
        this.options = options;
    }
    WebpackDependencyLoader.prototype.load = function (_a, _b) {
        var uri = _a.uri, hash = _a.hash;
        var type = _b.type, content = _b.content, map = _b.map;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var config, usableConfigLoaders, moduleLoaders, includedDependencyUris, contexts, loadNext, result, foundProviderPaths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Loading", uri);
                        config = this.strategy.config;
                        usableConfigLoaders = [];
                        if (!this.options.disableAllLoaders) {
                            if (!this.options.disablePreloaders)
                                usableConfigLoaders.push.apply(usableConfigLoaders, (config.module.preLoaders || []));
                            usableConfigLoaders.push.apply(usableConfigLoaders, config.module.loaders.concat((config.module.postLoaders || [])));
                        }
                        moduleLoaders = normalizeConfigLoaders.apply(void 0, usableConfigLoaders.filter(testLoader.bind(this, uri))).concat((this.options.loaders || []));
                        includedDependencyUris = [];
                        contexts = moduleLoaders.map(function (loader) {
                            return _this.strategy.kernel.inject(new WebpackLoaderContext(moduleLoaders, loader, _this.strategy, uri, hash, includedDependencyUris));
                        });
                        loadNext = function (content, map, index) {
                            if (index === void 0) { index = 0; }
                            return __awaiter(_this, void 0, void 0, function () {
                                var context, result, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (index >= contexts.length)
                                                return [2 /*return*/, { content: content, map: map }];
                                            context = contexts[index];
                                            return [4 /*yield*/, context.capture()];
                                        case 1:
                                            _a = (_b.sent());
                                            if (_a) return [3 /*break*/, 3];
                                            return [4 /*yield*/, loadNext(content, map, index + 1)];
                                        case 2:
                                            _a = (_b.sent());
                                            _b.label = 3;
                                        case 3:
                                            result = (_a);
                                            return [4 /*yield*/, context.load(result.content, result.map)];
                                        case 4: return [2 /*return*/, (_b.sent()) || result];
                                    }
                                });
                            });
                        };
                        return [4 /*yield*/, loadNext(content, map, 0)];
                    case 1:
                        result = _a.sent();
                        this.logger.debug("loaded", uri);
                        foundProviderPaths = detective(result.content);
                        return [2 /*return*/, {
                                map: result.map,
                                type: aerial_common_1.JS_MIME_TYPE,
                                content: result.content,
                                importedDependencyUris: foundProviderPaths,
                                includedDependencyUris: includedDependencyUris
                            }];
                }
            });
        });
    };
    return WebpackDependencyLoader;
}());
WebpackDependencyLoader = __decorate([
    aerial_common_1.loggable()
], WebpackDependencyLoader);
/**
 */
function normalizeConfigLoaders() {
    var loaders = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        loaders[_i] = arguments[_i];
    }
    var normalizedLoaders = [];
    for (var _a = 0, loaders_1 = loaders; _a < loaders_1.length; _a++) {
        var loader = loaders_1[_a];
        normalizedLoaders.push.apply(normalizedLoaders, parserLoaderOptions(loader.loader).loaders);
    }
    return normalizedLoaders;
}
/**
 */
function parserLoaderOptions(moduleInfo, hasFile) {
    if (hasFile === void 0) { hasFile = false; }
    var loaderParts = moduleInfo.replace(/^(-|!)?!/, "").split("!");
    if (hasFile)
        loaderParts.pop();
    var options = {
        disablePreloaders: /^-?!/.test(moduleInfo),
        disableAllLoaders: /^(-|!)!/.test(moduleInfo),
        loaders: (moduleInfo.length ? loaderParts : []).map(function (loaderName) {
            var _a = loaderName.split("?"), moduleName = _a[0], query = _a[1];
            return {
                modulePath: resolveNodeModule.sync(moduleName),
                query: query && "?" + query
            };
        })
    };
    return options;
}
var WebpackSandboxContext = (function () {
    function WebpackSandboxContext(_target) {
        this._target = _target;
        this.module = this;
        this.id = _target.source.hash;
        // TODO - need to check webpack config for this.
        this.__filename = _target.source.uri;
        this.__dirname = path.dirname(_target.source.uri);
    }
    Object.defineProperty(WebpackSandboxContext.prototype, "exports", {
        get: function () {
            return this._target.exports;
        },
        set: function (value) {
            this._target.exports = value;
        },
        enumerable: true,
        configurable: true
    });
    return WebpackSandboxContext;
}());
exports.WebpackSandboxContext = WebpackSandboxContext;
var WebpackProtocolResolver = (function () {
    function WebpackProtocolResolver() {
    }
    WebpackProtocolResolver.prototype.resolve = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var relativePath;
            return __generator(this, function (_a) {
                relativePath = url.replace("webpack://", "");
                return [2 /*return*/, relativePath.charAt(0) === "/" && fs.existsSync(relativePath) ? relativePath : path.join(process.cwd(), relativePath)];
            });
        });
    };
    return WebpackProtocolResolver;
}());
exports.WebpackProtocolResolver = WebpackProtocolResolver;
var WebpackProtocolHandler = (function () {
    function WebpackProtocolHandler() {
    }
    return WebpackProtocolHandler;
}());
exports.WebpackProtocolHandler = WebpackProtocolHandler;
/**
 */
var WebpackDependencyGraphStrategy = (function () {
    function WebpackDependencyGraphStrategy(options) {
        if (options === void 0) { options = {}; }
        var config = options.config;
        if (config && typeof config === "object") {
            this.basedir = process.cwd();
            this.config = config;
        }
        else {
            this.basedir = config && path.dirname(config) || process.cwd();
            this.config = require(config || path.join(this.basedir, "webpack.config.js"));
        }
        this.compiler = new MockWebpackCompiler();
        // custom config for TD environment.
        if (this.config.tandem && this.config.tandem.setup) {
            this.config.tandem.setup(this);
        }
        this._resolver = new resolver_1.NodeModuleResolver({
            extensions: [""].concat(this.config.resolve.extensions),
            directories: this.config.resolve.modulesDirectories.concat([this.config.resolve.root, this.basedir])
        });
    }
    Object.defineProperty(WebpackDependencyGraphStrategy.prototype, "kernel", {
        get: function () {
            return this._kernel;
        },
        enumerable: true,
        configurable: true
    });
    WebpackDependencyGraphStrategy.prototype.createGlobalContext = function () {
        // TODO - this needs to point to the proper registered protocol
        return {
            Buffer: Buffer,
            __webpack_public_path__: "http://" + this._config.hostname + ":" + this._config.port + "/file-cache/" + encodeURIComponent("webpack://"),
            // TODO _ this should be shared by other strategies later on
            process: {
                argv: [],
                version: process.version,
                nextTick: function (next) { return setTimeout(next, 0); },
                env: process.env,
                cwd: function () { return process.cwd(); }
            }
        };
    };
    WebpackDependencyGraphStrategy.prototype.createModuleContext = function (module) {
        return new WebpackSandboxContext(module);
    };
    /**
     * Results the relative file path from the cwd, and provides
     * information about how it should be treared.
     *
     * Examples:
     * const dependencyInfo = resolver.resolve('text!./module.mu');
     * const dependencyInfo = resolver.resolve('template!./module.mu');
     */
    WebpackDependencyGraphStrategy.prototype.getLoader = function (options) {
        return this._kernel.inject(new WebpackDependencyLoader(this, options));
    };
    WebpackDependencyGraphStrategy.prototype.resolve = function (moduleInfo, cwd) {
        return __awaiter(this, void 0, void 0, function () {
            var config, loaderOptions, relativeFilePath, resolvedFilePath, e_1, isCore, type, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = this.config;
                        moduleInfo = config.resolve.alias && config.resolve.alias[moduleInfo] || moduleInfo;
                        loaderOptions = parserLoaderOptions(moduleInfo, true);
                        relativeFilePath = moduleInfo.split("!").pop();
                        resolvedFilePath = relativeFilePath;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.logger.debug("Resolving " + cwd + ":" + relativeFilePath + " (" + moduleInfo + ")");
                        return [4 /*yield*/, this._resolver.resolve(relativeFilePath, cwd)];
                    case 2:
                        resolvedFilePath = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.logger.warn("Unable to resolve " + relativeFilePath);
                        return [3 /*break*/, 4];
                    case 4:
                        isCore = resolvedFilePath && resolveNodeModule.isCore(resolvedFilePath);
                        if (isCore) {
                            type = moduleInfo;
                            if (this.config.node) {
                                value = this.config.node[moduleInfo];
                                if (this.config.node[moduleInfo] === "empty") {
                                    type = "empty";
                                }
                            }
                            resolvedFilePath = nodeLibs[type] || resolveNodeModule.sync("node-libs-browser/mock/" + type);
                        }
                        return [2 /*return*/, {
                                uri: resolvedFilePath,
                                loaderOptions: loaderOptions,
                                hash: md5("webpack:" + resolvedFilePath + ":" + JSON.stringify(loaderOptions))
                            }];
                }
            });
        });
    };
    return WebpackDependencyGraphStrategy;
}());
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], WebpackDependencyGraphStrategy.prototype, "_kernel", void 0);
__decorate([
    aerial_common_1.inject(aerial_common_1.ApplicationConfigurationProvider.ID)
], WebpackDependencyGraphStrategy.prototype, "_config", void 0);
WebpackDependencyGraphStrategy = __decorate([
    aerial_common_1.loggable()
], WebpackDependencyGraphStrategy);
exports.WebpackDependencyGraphStrategy = WebpackDependencyGraphStrategy;
//# sourceMappingURL=index.js.map