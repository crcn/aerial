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
var mesh_1 = require("mesh");
var uri_1 = require("../uri");
var aerial_common_1 = require("aerial-common");
// TODO - need to check if file cache is up to date with local
// TODO - needs to support other protocols such as http, and in-app
var FileCacheSynchronizer = (function () {
    function FileCacheSynchronizer(_cache, _bus) {
        this._cache = _cache;
        this._bus = _bus;
        this._watchers = {};
        this._cache.collection.observe(new mesh_1.CallbackBus(this.update.bind(this)));
        this.update();
    }
    FileCacheSynchronizer.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var a, b;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._updating) {
                            this._shouldUpdateAgain = true;
                            return [2 /*return*/];
                        }
                        this._updating = true;
                        a = Object.keys(this._watchers);
                        b = this._cache.collection.map(function (item) { return item.sourceUri; });
                        return [4 /*yield*/, aerial_common_1.diffArray(a, b, function (a, b) { return a === b ? 0 : -1; }).accept({
                                visitInsert: function (_a) {
                                    var index = _a.index, value = _a.value;
                                    return __awaiter(_this, void 0, void 0, function () {
                                        var protocol, e_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!value)
                                                        return [2 /*return*/];
                                                    protocol = uri_1.URIProtocolProvider.lookup(value, this._kernel);
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, 3, , 4]);
                                                    return [4 /*yield*/, protocol.fileExists(value)];
                                                case 2:
                                                    if (_a.sent()) {
                                                        this._watchers[value] = protocol.watch(value, this.onURISourceChange.bind(this, value));
                                                    }
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    e_1 = _a.sent();
                                                    this.logger.error(e_1.stack);
                                                    return [3 /*break*/, 4];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    });
                                },
                                visitRemove: function (_a) {
                                    var index = _a.index;
                                    _this._watchers[a[index]].dispose();
                                },
                                visitUpdate: function () { }
                            })];
                    case 1:
                        _a.sent();
                        this._updating = false;
                        if (this._shouldUpdateAgain) {
                            this._shouldUpdateAgain = false;
                            this.update();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FileCacheSynchronizer.prototype.onURISourceChange = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._cache.find(uri)];
                    case 1:
                        entity = _a.sent();
                        this.logger.debug(uri + " changed, updating cache.");
                        // just set the timestamp instead of checking lstat -- primarily
                        // to ensure that this class works in other environments.
                        entity.contentUpdatedAt = Date.now();
                        // override any data urls that might be stored on the entity
                        entity.setContentUri(uri).save();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FileCacheSynchronizer;
}());
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], FileCacheSynchronizer.prototype, "_kernel", void 0);
FileCacheSynchronizer = __decorate([
    aerial_common_1.loggable()
], FileCacheSynchronizer);
exports.FileCacheSynchronizer = FileCacheSynchronizer;
//# sourceMappingURL=synchronizer.js.map