"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var helpers_1 = require("../../test/helpers");
var __1 = require("../..");
var aerial_common_1 = require("aerial-common");
describe(__filename + "#", function () {
    var createSandboxSingletons = function (mockFiles) {
        var kernel = helpers_1.createSandboxTestKernel({ mockFiles: mockFiles });
        return {
            fileCache: __1.FileCacheProvider.getInstance(kernel),
            fileProtocol: __1.URIProtocolProvider.lookup("file://", kernel),
        };
    };
    it("loads a file from the file system on request", function () { return __awaiter(_this, void 0, void 0, function () {
        var fileCache, item, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fileCache = createSandboxSingletons({
                        "entry.js": "hello world"
                    }).fileCache;
                    return [4 /*yield*/, fileCache.findOrInsert("entry.js")];
                case 1:
                    item = _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, item.read()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).to.eql({ type: "application/javascript", content: "hello world" });
                    return [2 /*return*/];
            }
        });
    }); });
    it("caches loaded items", function () { return __awaiter(_this, void 0, void 0, function () {
        var fileCache, item, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fileCache = createSandboxSingletons({
                        "entry.js": "a"
                    }).fileCache;
                    return [4 /*yield*/, fileCache.findOrInsert("entry.js")];
                case 1:
                    item = _c.sent();
                    _b = (_a = chai_1.expect(item).to).eql;
                    return [4 /*yield*/, fileCache.find("entry.js")];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    describe("file cache item#", function () {
        it("reloads the source file changes", function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, fileProtocol, fileCache, item, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = createSandboxSingletons({
                            "entry.js": "a"
                        }), fileProtocol = _a.fileProtocol, fileCache = _a.fileCache;
                        return [4 /*yield*/, fileCache.findOrInsert("entry.js")];
                    case 1:
                        item = _d.sent();
                        _b = chai_1.expect;
                        return [4 /*yield*/, item.read()];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.eql({ type: "application/javascript", content: "a" });
                        return [4 /*yield*/, fileProtocol.write("entry.js", "b")];
                    case 3:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, item.read()];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.eql({ type: "application/javascript", content: "b" });
                        return [2 /*return*/];
                }
            });
        }); });
        it("emits a change when changing the data url", function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var fileCache, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileCache = createSandboxSingletons({
                            "entry.js": "a"
                        }).fileCache;
                        return [4 /*yield*/, fileCache.findOrInsert("entry.js")];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            item.observe({
                                                dispatch: function (_a) {
                                                    var mutation = _a.mutation;
                                                    if (mutation && mutation.type === aerial_common_1.PropertyMutation.PROPERTY_CHANGE) {
                                                        chai_1.expect(item.contentUri).to.equal("data:application/javascript,aGVsbG8=");
                                                        resolve();
                                                    }
                                                }
                                            });
                                            return [4 /*yield*/, item.setDataUrlContent("hello")];
                                        case 1:
                                            _a.sent();
                                            item.save();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                }
            });
        }); });
        it("emits a changes when the source file changes", function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, fileProtocol, fileCache, item, mtime;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = createSandboxSingletons({
                            "entry.js": "a"
                        }), fileProtocol = _a.fileProtocol, fileCache = _a.fileCache;
                        return [4 /*yield*/, fileCache.findOrInsert("file://entry.js")];
                    case 1:
                        item = _b.sent();
                        mtime = item.contentUpdatedAt;
                        return [2 /*return*/, new Promise(function (resolve) {
                                item.observe({
                                    dispatch: function (_a) {
                                        var mutation = _a.mutation;
                                        if (mutation.type === aerial_common_1.PropertyMutation.PROPERTY_CHANGE) {
                                            chai_1.expect(item.contentUri).to.equal("file://entry.js");
                                            chai_1.expect(item.contentUpdatedAt).to.not.equal(mtime);
                                            resolve();
                                        }
                                    }
                                });
                                fileProtocol.write("entry.js", "b");
                            })];
                }
            });
        }); });
    });
});
//# sourceMappingURL=core-test.js.map