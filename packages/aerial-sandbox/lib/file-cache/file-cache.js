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
var synchronizer_1 = require("./synchronizer");
var aerial_common_1 = require("aerial-common");
var mesh_ds_1 = require("mesh-ds");
var mesh_1 = require("mesh");
var item_1 = require("./item");
exports.FILE_CACHE_COLLECTION_NAME = "fileCache";
exports.getAllUnsavedFiles = function (kernel) {
    return new Promise(function (resolve, reject) {
        var chunks = [];
        aerial_common_1.PrivateBusProvider.getInstance(kernel).dispatch(new mesh_ds_1.DSFindRequest(exports.FILE_CACHE_COLLECTION_NAME, { synchronized: false }, true)).readable.pipeTo(new mesh_1.WritableStream({
            write: function (chunk) {
                chunks.push(chunk);
            },
            close: function () {
                resolve(chunks.map(function (item) { return kernel.inject(new item_1.FileCacheItem(item, exports.FILE_CACHE_COLLECTION_NAME)); }));
            },
            abort: reject
        }));
    });
};
// TODO - move a lot of this logic to ActiveRecordCollection
// TODO - remove files here after TTL
var FileCache = (function (_super) {
    __extends(FileCache, _super);
    function FileCache() {
        var _this = _super.call(this) || this;
        /**
         * Returns an existing cache item entry, or creates a new one
         * from the file system
         */
        _this.find = memoize(function (sourceUri) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (sourceUri == null)
                            throw new Error("File path must not be null or undefined");
                        _a = this.collection.find(function (entity) { return entity.sourceUri === sourceUri; });
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.loadItem({ sourceUri: sourceUri })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        }); }, { promise: true });
        /**
         * Returns an existing cache item entry, or creates a new one
         * from the file system
         */
        _this.findOrInsert = memoize(function (sourceUri) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (sourceUri == null)
                            throw new Error("File path must not be null or undefined");
                        _a = this.collection.find(function (entity) { return entity.sourceUri === sourceUri; });
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.save(sourceUri)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        }); }, { promise: true });
        return _this;
    }
    FileCache.prototype.$didInject = function () {
        var _this = this;
        this._collection = aerial_common_1.ActiveRecordCollection.create(this.collectionName, this._kernel, function (source) {
            return _this._kernel.inject(new item_1.FileCacheItem(source, _this.collectionName));
        });
        this._collection.load();
        this._collection.sync();
    };
    FileCache.prototype.eagerFindByFilePath = function (sourceUri) {
        return this.collection.find(function (item) { return item.sourceUri === sourceUri; });
    };
    Object.defineProperty(FileCache.prototype, "collection", {
        get: function () {
            return this._collection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileCache.prototype, "collectionName", {
        get: function () {
            return exports.FILE_CACHE_COLLECTION_NAME;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ability to shove temporary files into mem -- like unsaved files.
     */
    FileCache.prototype.save = function (sourceUri, data) {
        return __awaiter(this, void 0, void 0, function () {
            var fileCache, type;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.loadItem({ sourceUri: sourceUri })];
                    case 1:
                        fileCache = _a.sent();
                        if (!!fileCache) return [3 /*break*/, 2];
                        type = data && data.type || aerial_common_1.MimeTypeProvider.lookup(sourceUri, this._kernel);
                        return [2 /*return*/, this.collection.create({
                                type: type,
                                sourceUri: sourceUri,
                                contentUri: data ? aerial_common_1.createDataUrl(data.content, type) : sourceUri,
                                contentUpdatedAt: 0,
                            }).insert()];
                    case 2:
                        if (!(data && data.content)) return [3 /*break*/, 4];
                        if (data.type)
                            fileCache.type = data.type;
                        return [4 /*yield*/, fileCache.setDataUrlContent(data.content)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, fileCache.save()];
                }
            });
        });
    };
    /**
     * Synchronizes the file cache DS with the file system. This is intended
     * to be used the master process -- typically the node server.
     */
    FileCache.prototype.syncWithLocalFiles = function () {
        return this._synchronizer || (this._synchronizer = this._kernel.inject(new synchronizer_1.FileCacheSynchronizer(this, this._bus)));
    };
    return FileCache;
}(aerial_common_1.Observable));
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], FileCache.prototype, "_kernel", void 0);
__decorate([
    aerial_common_1.inject(aerial_common_1.PrivateBusProvider.ID)
], FileCache.prototype, "_bus", void 0);
exports.FileCache = FileCache;
//# sourceMappingURL=file-cache.js.map