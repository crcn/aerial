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
var memoize = require("memoizee");
var lodash_1 = require("lodash");
var messages_1 = require("./messages");
var watcher_1 = require("./watcher");
var providers_1 = require("../providers");
var mesh_1 = require("mesh");
var aerial_common_1 = require("aerial-common");
// TODO - cover case where depenedency doesn't exist
var Dependency = (function (_super) {
    __extends(Dependency, _super);
    function Dependency(source, collectionName, _graph) {
        var _this = _super.call(this, source, collectionName) || this;
        _this._graph = _graph;
        _this.idProperty = "hash";
        _this.status = new aerial_common_1.Status(aerial_common_1.Status.IDLE);
        _this.load2 = memoize(function () { return __awaiter(_this, void 0, void 0, function () {
            var logTimer, fileCache, sourceFileUpdatedAt, e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.debug("Loading...");
                        logTimer = this.logger.startTimer(null, null, aerial_common_1.LogLevel.DEBUG);
                        return [4 /*yield*/, this.getSourceFileCacheItem()];
                    case 1:
                        fileCache = _b.sent();
                        return [4 /*yield*/, this.getLatestSourceFileUpdateTimestamp()];
                    case 2:
                        sourceFileUpdatedAt = _b.sent();
                        if (!(this._sourceUpdatedAt !== sourceFileUpdatedAt)) return [3 /*break*/, 9];
                        // sync update times. TODO - need to include included files as well. This is at the beginning
                        // in case the file cache item changes while the dependency is loading (shouldn't happen so often).
                        this._sourceUpdatedAt = sourceFileUpdatedAt;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 7]);
                        return [4 /*yield*/, this.loadHard()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        e_1 = _b.sent();
                        this.logger.error("Error: " + e_1.stack);
                        this._sourceUpdatedAt = undefined;
                        return [4 /*yield*/, this.watchForChanges()];
                    case 6:
                        _b.sent();
                        throw e_1;
                    case 7: return [4 /*yield*/, this.save()];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        this.logger.debug("No change. Reusing cached content.");
                        _b.label = 10;
                    case 10: return [4 /*yield*/, this.loadDependencies()];
                    case 11:
                        _b.sent();
                        logTimer.stop("loaded");
                        _a = this._sourceUpdatedAt;
                        return [4 /*yield*/, this.getLatestSourceFileUpdateTimestamp()];
                    case 12:
                        if (_a !== (_b.sent())) {
                            this.logger.debug("File cache changed during load, reloading.");
                            return [2 /*return*/, this.reload()];
                        }
                        // watch for changes now prevent cyclical dependencies from cyclically
                        // listening and emitting the same "done" messages
                        return [4 /*yield*/, this.watchForChanges()];
                    case 13:
                        // watch for changes now prevent cyclical dependencies from cyclically
                        // listening and emitting the same "done" messages
                        _b.sent();
                        return [2 /*return*/, this];
                }
            });
        }); }, { length: 0, promise: true });
        _this._fileCacheItemObserver = new mesh_1.CallbackBus(_this.onFileCacheAction.bind(_this));
        return _this;
    }
    Dependency.prototype.$didInject = function () {
        var _this = this;
        this.logger.generatePrefix = function () { return _this.hash + ":" + _this.uri + " "; };
    };
    /**
     * The file cache reference that contains
     *
     * @readonly
     * @type {FileCacheItem}
     */
    Dependency.prototype.getSourceFileCacheItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this._fileCacheItem)
                            return [2 /*return*/, this._fileCacheItem];
                        _a = this;
                        return [4 /*yield*/, this._fileCache.findOrInsert(this.uri)];
                    case 1: return [2 /*return*/, _a._fileCacheItem = _b.sent()];
                }
            });
        });
    };
    Object.defineProperty(Dependency.prototype, "graph", {
        get: function () {
            return this._graph;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "updatedAt", {
        /**
         * Timestamp of when the bundle was last persisted to the data store.
         *
         * @readonly
         * @type {number}
         */
        get: function () {
            return this._updatedAt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "hash", {
        /**
         */
        get: function () {
            return this._hash;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "map", {
        /**
         * The source map of the transformed content.
         *
         * @readonly
         */
        get: function () {
            return this._map;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "uri", {
        /**
         * The source file path
         *
         * @readonly
         */
        get: function () {
            return this._uri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "importedDependencyInfo", {
        /**
         */
        get: function () {
            return this._importedDependencyInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "includedDependencyInfo", {
        /**
         */
        get: function () {
            return this._includedDependencyInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "loaderOptions", {
        /**
         */
        get: function () {
            return this._loaderOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "type", {
        /**
         * The loaded bundle type
         *
         * @readonly
         */
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "importedDependencies", {
        /**
         * The dependency bundle references
         *
         * @readonly
         * @type {Dependency[]}
         */
        get: function () {
            var _this = this;
            return this._importedDependencyInfo.map(function (inf) {
                return _this._graph.eagerFindByHash(inf.hash);
            }).filter(function (dep) { return !!dep; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dependency.prototype, "content", {
        /**
         * The loaded bundle content
         *
         * @readonly
         * @type {string}
         */
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    Dependency.prototype.willSave = function () {
        this._updatedAt = Date.now();
    };
    Dependency.prototype.getDependencyHash = function (uri) {
        var info = this._importedDependencyInfo.find(function (info) { return info.originalUri === uri || info.uri === uri; });
        return info && info.hash;
    };
    Dependency.prototype.eagerGetDependency = function (uri) {
        return this._graph.eagerFindByHash(this.getDependencyHash(uri));
    };
    Dependency.prototype.serialize = function () {
        return {
            uri: this.uri,
            map: this._map,
            hash: this._hash,
            type: this._type,
            content: this._content,
            updatedAt: this._updatedAt,
            loaderOptions: this._loaderOptions,
            sourceUpdatedAt: this._sourceUpdatedAt,
            includedDependencyInfo: this._includedDependencyInfo,
            importedDependencyInfo: this._importedDependencyInfo,
        };
    };
    Dependency.prototype.setPropertiesFromSource = function (_a) {
        var uri = _a.uri, loaderOptions = _a.loaderOptions, type = _a.type, updatedAt = _a.updatedAt, map = _a.map, content = _a.content, importedDependencyInfo = _a.importedDependencyInfo, includedDependencyInfo = _a.includedDependencyInfo, hash = _a.hash, sourceUpdatedAt = _a.sourceUpdatedAt;
        this._type = type;
        this._uri = uri;
        this._loaderOptions = loaderOptions || {};
        this._updatedAt = updatedAt;
        this._sourceUpdatedAt = sourceUpdatedAt;
        this._hash = hash;
        this._map = map;
        this._content = content;
        this._importedDependencyInfo = importedDependencyInfo || [];
        this._includedDependencyInfo = includedDependencyInfo || [];
    };
    Object.defineProperty(Dependency.prototype, "watcher", {
        get: function () {
            return this._watcher || (this._watcher = new watcher_1.DependencyGraphWatcher(this));
        },
        enumerable: true,
        configurable: true
    });
    Dependency.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // safe method that protects _loading from being locked
                // from errors.
                if (this.status.type === aerial_common_1.Status.LOADING || this.status.type === aerial_common_1.Status.COMPLETED) {
                    return [2 /*return*/, this.load2()];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.status = new aerial_common_1.Status(aerial_common_1.Status.LOADING);
                        _this.load2().then(function () {
                            _this.status = new aerial_common_1.Status(aerial_common_1.Status.COMPLETED);
                            _this.notify(new messages_1.DependencyEvent(messages_1.DependencyEvent.DEPENDENCY_LOADED));
                            if (_this._shouldLoadAgain) {
                                _this._shouldLoadAgain = false;
                                _this.load().then(resolve, reject);
                            }
                            else {
                                resolve(_this);
                            }
                        }, function (err) {
                            _this.status = new aerial_common_1.Status(aerial_common_1.Status.ERROR);
                            reject(err);
                        });
                    })];
            });
        });
    };
    Dependency.prototype.getLatestSourceFileUpdateTimestamp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _b = (_a = Math.max).apply;
                        _c = [Math];
                        _e = (_d = [this._sourceUpdatedAt || 0]).concat;
                        return [4 /*yield*/, this.getSourceFiles()];
                    case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_e.apply(_d, [((_f.sent()).map(function (sourceFile) { return sourceFile.updatedAt || 0; }))])]))];
                }
            });
        });
    };
    Dependency.prototype.getSourceFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var cacheItem, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getSourceFileCacheItem()];
                    case 1:
                        cacheItem = _c.sent();
                        _b = (_a = [
                            cacheItem
                        ]).concat;
                        return [4 /*yield*/, Promise.all(this._includedDependencyInfo.map(function (info) { return _this._fileCache.findOrInsert(info.uri); }))];
                    case 2: return [2 /*return*/, _b.apply(_a, [(_c.sent())])];
                }
            });
        });
    };
    /**
     */
    Dependency.prototype.loadHard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loader, transformResult, _a, _b, _c, importedDependencyUris, includedDependencyUris;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.logger.debug("Transforming source content using graph strategy");
                        loader = this._graph.getLoader(this._loaderOptions);
                        _b = (_a = loader).load;
                        _c = [this];
                        return [4 /*yield*/, this.getInitialSourceContent()];
                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                    case 2:
                        transformResult = _d.sent();
                        // must be casted since the content could be a buffer
                        this._content = String(transformResult.content);
                        this._map = transformResult.map;
                        this._type = transformResult.type;
                        this._importedDependencyInfo = [];
                        this._includedDependencyInfo = [];
                        importedDependencyUris = transformResult.importedDependencyUris || [];
                        includedDependencyUris = lodash_1.pull.apply(void 0, [transformResult.includedDependencyUris || []].concat(importedDependencyUris));
                        return [4 /*yield*/, Promise.all([
                                this.resolveDependencies(includedDependencyUris, this._includedDependencyInfo),
                                this.resolveDependencies(importedDependencyUris, this._importedDependencyInfo)
                            ])];
                    case 3:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     */
    Dependency.prototype.loadDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.importedDependencyInfo.map(function (info) { return __awaiter(_this, void 0, void 0, function () {
                            var dependency, waitLogger, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!info.uri)
                                            return [2 /*return*/, Promise.resolve()];
                                        return [4 /*yield*/, this._graph.getDependency(info)];
                                    case 1:
                                        dependency = _a.sent();
                                        waitLogger = this.logger.startTimer("Waiting for dependency " + info.hash + ":" + info.uri + " to load...", 1000 * 10, aerial_common_1.LogLevel.DEBUG);
                                        if (!(dependency.status.type !== aerial_common_1.Status.LOADING)) return [3 /*break*/, 5];
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, dependency.load()];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_2 = _a.sent();
                                        waitLogger.stop("Error while loading dependency: " + info.uri);
                                        return [3 /*break*/, 5];
                                    case 5:
                                        waitLogger.stop("Loaded dependency " + info.hash + ":" + info.uri);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * TODO: may be better to make this part of the loader
     */
    Dependency.prototype.getInitialSourceContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var readResult, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.uri;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getSourceFileCacheItem()];
                    case 1: return [4 /*yield*/, (_b.sent()).read()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        readResult = _a;
                        return [2 /*return*/, {
                                type: readResult && readResult.type || aerial_common_1.MimeTypeProvider.lookup(this.uri, this._kernel) || aerial_common_1.PLAIN_TEXT_MIME_TYPE,
                                content: readResult && readResult.content
                            }];
                }
            });
        });
    };
    Dependency.prototype.shouldDeserialize = function (b) {
        return b.updatedAt > this.updatedAt;
    };
    Dependency.prototype.watchForChanges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var changeWatchers, _loop_1, this_1, _i, _a, sourceFile;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this._changeWatchers) {
                            this._changeWatchers.dispose();
                        }
                        changeWatchers = this._changeWatchers = aerial_common_1.DisposableCollection.create();
                        _loop_1 = function (sourceFile) {
                            this_1.logger.debug("Watching file cache " + sourceFile.sourceUri + " for changes");
                            sourceFile.observe(this_1._fileCacheItemObserver);
                            changeWatchers.push({
                                dispose: function () { return sourceFile.unobserve(_this._fileCacheItemObserver); }
                            });
                        };
                        this_1 = this;
                        _i = 0;
                        return [4 /*yield*/, this.getSourceFiles()];
                    case 1:
                        _a = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        sourceFile = _a[_i];
                        _loop_1(sourceFile);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Dependency.prototype.visitWalker = function (walker) {
        this.importedDependencies.forEach(function (dependency) { return walker.accept(dependency); });
    };
    Dependency.prototype.resolveDependencies = function (dependencyPaths, info) {
        var _this = this;
        return Promise.all(dependencyPaths.map(function (uri) { return __awaiter(_this, void 0, void 0, function () {
            var dependencyInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Resolving dependency", uri);
                        return [4 /*yield*/, this._graph.resolve(uri, this.uri)];
                    case 1:
                        dependencyInfo = _a.sent();
                        dependencyInfo.originalUri = uri;
                        info.push(dependencyInfo);
                        return [2 /*return*/];
                }
            });
        }); }));
    };
    Dependency.prototype.reload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.load2["clear"]();
                this.status = new aerial_common_1.Status(aerial_common_1.Status.IDLE);
                this.logger.debug("Reloading");
                return [2 /*return*/, this.load()];
            });
        });
    };
    Dependency.prototype.onFileCacheAction = function (_a) {
        var mutation = _a.mutation;
        // reload the dependency if file cache item changes -- could be the data uri, source file, etc.
        if (mutation && mutation.type === aerial_common_1.PropertyMutation.PROPERTY_CHANGE) {
            if (this.status.type !== aerial_common_1.Status.LOADING) {
                this.logger.info("Source file changed");
                this.reload();
            }
            else {
                this._shouldLoadAgain = true;
            }
        }
    };
    return Dependency;
}(aerial_common_1.BaseActiveRecord));
__decorate([
    aerial_common_1.inject(providers_1.FileCacheProvider.ID)
], Dependency.prototype, "_fileCache", void 0);
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], Dependency.prototype, "_kernel", void 0);
__decorate([
    aerial_common_1.bindable()
], Dependency.prototype, "status", void 0);
Dependency = __decorate([
    aerial_common_1.loggable()
], Dependency);
exports.Dependency = Dependency;
//# sourceMappingURL=dependency.js.map