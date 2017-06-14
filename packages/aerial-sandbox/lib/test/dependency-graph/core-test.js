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
var sinon = require("sinon");
var chai_1 = require("chai");
var aerial_common_1 = require("aerial-common");
var __1 = require("../..");
var test_1 = require("../../test");
describe(__filename + "#", function () {
    var createDefaultDependencyGraph = function (mockFiles, providers) {
        return test_1.createTestDependencyGraph({}, { mockFiles: mockFiles, providers: providers });
    };
    it("loads files as plain text if there's no loader associated with them", function () { return __awaiter(_this, void 0, void 0, function () {
        var graph, entry, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    graph = createDefaultDependencyGraph({
                        'entry.js': 'hello world'
                    });
                    _b = (_a = graph).getDependency;
                    return [4 /*yield*/, graph.resolve('entry.js', '')];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 2:
                    entry = _c.sent();
                    return [4 /*yield*/, entry.load()];
                case 3:
                    _c.sent();
                    chai_1.expect(entry.type).to.equal("application/javascript");
                    chai_1.expect(entry.content).to.equal("hello world");
                    return [2 /*return*/];
            }
        });
    }); });
    it("doesn't reload a dependency during a middle of a load", function () { return __awaiter(_this, void 0, void 0, function () {
        var graph, entry, _a, _b, loadInitialSourceContentSpy;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    graph = createDefaultDependencyGraph({
                        'entry.js': 'hello world'
                    });
                    _b = (_a = graph).getDependency;
                    return [4 /*yield*/, graph.resolve('entry.js', '')];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 2:
                    entry = _c.sent();
                    loadInitialSourceContentSpy = sinon.spy(entry, "getInitialSourceContent");
                    entry.load();
                    return [4 /*yield*/, entry.load()];
                case 3:
                    _c.sent();
                    chai_1.expect(loadInitialSourceContentSpy.callCount).to.eql(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("reloads the dependency when the source file has changed", function () { return __awaiter(_this, void 0, void 0, function () {
        var graph, dependency, _a, _b, fileCacheItem;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    graph = createDefaultDependencyGraph({
                        'entry.js': 'a'
                    });
                    _b = (_a = graph).loadDependency;
                    return [4 /*yield*/, graph.resolve('entry.js', '')];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 2:
                    dependency = _c.sent();
                    return [4 /*yield*/, dependency.getSourceFileCacheItem()];
                case 3:
                    fileCacheItem = _c.sent();
                    return [4 /*yield*/, fileCacheItem.setDataUrlContent("b")];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, fileCacheItem.save()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, dependency.load()];
                case 6:
                    _c.sent();
                    chai_1.expect(dependency.content.toString()).to.equal("b");
                    return [2 /*return*/];
            }
        });
    }); });
    it("reloads a dependency if the source file cache changes during a load", function () { return __awaiter(_this, void 0, void 0, function () {
        var graph, dependency, _a, _b, fileCacheItem;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    graph = createDefaultDependencyGraph({
                        'entry.js': 'a'
                    });
                    _b = (_a = graph).loadDependency;
                    return [4 /*yield*/, graph.resolve('entry.js', '')];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 2:
                    dependency = _c.sent();
                    return [4 /*yield*/, dependency.getSourceFileCacheItem()];
                case 3:
                    fileCacheItem = _c.sent();
                    return [4 /*yield*/, fileCacheItem.setDataUrlContent("b")];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, fileCacheItem.save()];
                case 5:
                    _c.sent();
                    dependency.load();
                    return [4 /*yield*/, fileCacheItem.setDataUrlContent("c")];
                case 6:
                    _c.sent();
                    fileCacheItem.save();
                    chai_1.expect(dependency.status.type).to.equal(aerial_common_1.Status.LOADING);
                    // wait on the current load request
                    return [4 /*yield*/, dependency.load()];
                case 7:
                    // wait on the current load request
                    _c.sent();
                    chai_1.expect(dependency.content.toString()).to.equal("c");
                    return [2 /*return*/];
            }
        });
    }); });
    xit("can return the dependency info of a dependency based on the relative path");
    xit("can return the dependency info of a dependency based on the absolute path");
    it("can use a custom loader & evaluator registered in the global kernel", function () { return __awaiter(_this, void 0, void 0, function () {
        var graph, entry, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    graph = createDefaultDependencyGraph({
                        'entry.mu': "import(a.mu); import(b.mu);",
                        'a.mu': 'import(c.mu);',
                        'b.mu': 'hello',
                        'c.mu': 'world'
                    }, [
                        new aerial_common_1.MimeTypeProvider('mu', 'text/mu'),
                        new __1.DependencyLoaderFactoryProvider('text/mu', (function () {
                            function class_1() {
                            }
                            class_1.prototype.load = function (_a, _b) {
                                var uri = _a.uri;
                                var type = _b.type, content = _b.content;
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, {
                                                type: "text/plain",
                                                content: content,
                                                importedDependencyUris: (content.match(/import\((.*?)\)/g) || []).map(function (expression) {
                                                    return expression.match(/\((.*?)\)/)[1];
                                                })
                                            }];
                                    });
                                });
                            };
                            return class_1;
                        }())),
                        new __1.SandboxModuleEvaluatorFactoryProvider('text/plain', (function () {
                            function class_2() {
                            }
                            class_2.prototype.evaluate = function (module) {
                                module.exports = module.source.content.replace(/import\((.*?)\);?/g, function (match, dependencyPath) {
                                    return module.sandbox.evaluate(module.source.eagerGetDependency(dependencyPath));
                                }).toUpperCase();
                            };
                            return class_2;
                        }()))
                    ]);
                    _b = (_a = graph).getDependency;
                    return [4 /*yield*/, graph.resolve('entry.mu', '')];
                case 1: return [4 /*yield*/, _b.apply(_a, [_d.sent()])];
                case 2:
                    entry = _d.sent();
                    return [4 /*yield*/, entry.load()];
                case 3:
                    _d.sent();
                    _c = chai_1.expect;
                    return [4 /*yield*/, test_1.evaluateDependency(entry)];
                case 4:
                    _c.apply(void 0, [_d.sent()]).to.eql("WORLD HELLO");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=core-test.js.map