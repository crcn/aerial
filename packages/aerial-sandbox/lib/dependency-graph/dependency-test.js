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
var aerial_common_1 = require("aerial-common");
var helpers_1 = require("../test/helpers");
var __1 = require("..");
var MockDependencyGraph = (function () {
    function MockDependencyGraph(kernel) {
        this.kernel = kernel;
        this._deps = {};
    }
    MockDependencyGraph.prototype.createGlobalContext = function () { };
    MockDependencyGraph.prototype.createModuleContext = function () { };
    MockDependencyGraph.prototype.eagerFindByHash = function (hash) {
        return this._deps[hash];
    };
    MockDependencyGraph.prototype.resolve = function (uri, origin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve({
                        hash: uri,
                        uri: origin + uri
                        // uri: await FileResolverProvider.getInstance(this.kernel).resolve(uri, origin)
                    })];
            });
        });
    };
    MockDependencyGraph.prototype.getDependency = function (info) {
        return this._deps[info.hash] || (this._deps[info.hash] = this.kernel.inject(new __1.Dependency(info, "collection", this)));
    };
    MockDependencyGraph.prototype.loadDependency = function () {
        return Promise.resolve(null);
    };
    MockDependencyGraph.prototype.getLoader = function (options) {
        return {
            load: function (info, options) {
                if (options.content.throwError)
                    return Promise.reject(new Error("Mock error"));
                return Promise.resolve({
                    type: "plain/text",
                    content: options.content.content,
                    importedDependencyUris: options.content.importedDependencyUris
                });
            }
        };
    };
    return MockDependencyGraph;
}());
describe(__filename + "#", function () {
    var createMockDependency = function (data, mockFiles) {
        var kernel = helpers_1.createSandboxTestKernel({ mockFiles: mockFiles });
        var dependency = new __1.Dependency(data, "collection", new MockDependencyGraph(kernel));
        kernel.inject(dependency);
        return dependency;
    };
    it("Can load a dependency", function () { return __awaiter(_this, void 0, void 0, function () {
        var dep;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dep = createMockDependency({
                        uri: "a"
                    }, { "a": { content: "blarg" } });
                    return [4 /*yield*/, dep.load()];
                case 1:
                    _a.sent();
                    chai_1.expect(dep.content).to.equal("blarg");
                    return [2 /*return*/];
            }
        });
    }); });
    xit("Can reload a dependency if an error is thrown during load", function () { return __awaiter(_this, void 0, void 0, function () {
        var depa, dep, err, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    depa = { throwError: false, content: "something" };
                    dep = createMockDependency({
                        uri: "a"
                    }, { "a": depa });
                    depa.throwError = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dep.load()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    err = e_1;
                    return [3 /*break*/, 4];
                case 4:
                    // sanity
                    chai_1.expect(err.message).to.contain("Mock error");
                    depa.throwError = false;
                    // need to give memoizee a sec for its cache to bust.
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1); })];
                case 5:
                    // need to give memoizee a sec for its cache to bust.
                    _a.sent();
                    chai_1.expect(dep.status.type).to.equal(aerial_common_1.Status.ERROR);
                    return [4 /*yield*/, dep.getSourceFileCacheItem()];
                case 6:
                    // dep assumes that if there's an error on the initial load, then there will be another
                    // error again unless the source file has changed. For that, we'll need to touch the source file.
                    (_a.sent()).updatedAt = Date.now();
                    return [4 /*yield*/, dep.load()];
                case 7:
                    _a.sent();
                    chai_1.expect(dep.status.type).to.equal(aerial_common_1.Status.COMPLETED);
                    chai_1.expect(dep.content).to.equal("something");
                    return [2 /*return*/];
            }
        });
    }); });
    xit("Can reload a dependency if a nested dependency errors", function () { return __awaiter(_this, void 0, void 0, function () {
        var depc, dep, err, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dep = createMockDependency({
                        uri: "a"
                    }, {
                        a: {
                            content: "aa",
                            importedDependencyUris: ["b", "c"]
                        },
                        b: {
                            content: "bb"
                        },
                        c: depc = {
                            content: "cc",
                            throwError: true
                        }
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dep.load()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    err = e_2;
                    return [3 /*break*/, 4];
                case 4:
                    // sanity
                    chai_1.expect(err.message).to.contain("Mock error");
                    depc.throwError = false;
                    // need to give memoizee a sec for its cache to bust.
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1); })];
                case 5:
                    // need to give memoizee a sec for its cache to bust.
                    _a.sent();
                    chai_1.expect(dep.status.type).to.equal(aerial_common_1.Status.ERROR);
                    chai_1.expect(dep.eagerGetDependency("c").status.type).to.equal(aerial_common_1.Status.ERROR);
                    return [4 /*yield*/, dep.load()];
                case 6:
                    _a.sent();
                    chai_1.expect(dep.eagerGetDependency("c").status.type).to.equal(aerial_common_1.Status.COMPLETED);
                    chai_1.expect(dep.content).to.equal("aa");
                    return [2 /*return*/];
            }
        });
    }); });
    it("emits a DEPENDENCY_LOADED message even when load() is called multiple times", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, dep;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    dep = createMockDependency({
                        uri: "a"
                    }, { a: { content: "aa" } });
                    dep.observe({
                        dispatch: function (message) { return message.type === __1.DependencyEvent.DEPENDENCY_LOADED ? i++ : 0; }
                    });
                    return [4 /*yield*/, dep.load()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dep.load()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dep.load()];
                case 3:
                    _a.sent();
                    chai_1.expect(i).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=dependency-test.js.map