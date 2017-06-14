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
var sinon = require("sinon");
var __1 = require("../..");
var helpers_1 = require("../../test/helpers");
describe(__filename + "#", function () {
    xit("can evaluate an entry", function () { return __awaiter(_this, void 0, void 0, function () {
        var kernel, sandbox, graph, dep, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    kernel = helpers_1.createSandboxTestKernel({
                        mockFiles: {
                            "a.js": "module.exports = require('./b.js')",
                            "b.js": "module.exports = 'bb';"
                        }
                    });
                    sandbox = new __1.Sandbox(kernel);
                    graph = __1.DependencyGraphProvider.getInstance({ name: "webpack" }, kernel);
                    _b = (_a = graph).getDependency;
                    return [4 /*yield*/, graph.resolve("a.js", "")];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 2:
                    dep = _c.sent();
                    return [4 /*yield*/, sandbox.open(dep)];
                case 3:
                    _c.sent();
                    chai_1.expect(sandbox.exports).to.equal("bb");
                    return [2 /*return*/];
            }
        });
    }); });
    xit("re-evaluates a dependency if it changes", function () { return __awaiter(_this, void 0, void 0, function () {
        var kernel, sandbox, graph, dep, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    kernel = helpers_1.createSandboxTestKernel({
                        mockFiles: {
                            "a.js": "module.exports = require('./b.js')",
                            "b.js": "module.exports = 'bb';"
                        }
                    });
                    sandbox = new __1.Sandbox(kernel);
                    graph = __1.DependencyGraphProvider.getInstance({ name: "webpack" }, kernel);
                    _b = (_a = graph).getDependency;
                    return [4 /*yield*/, graph.resolve("a.js", "")];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 2:
                    dep = _c.sent();
                    return [4 /*yield*/, sandbox.open(dep)];
                case 3:
                    _c.sent();
                    chai_1.expect(sandbox.exports).to.equal("bb");
                    return [4 /*yield*/, dep.getSourceFileCacheItem()];
                case 4: return [4 /*yield*/, (_c.sent()).setDataUrlContent("module.exports = 'aa'")];
                case 5: return [4 /*yield*/, (_c.sent()).save()];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, helpers_1.timeout(10)];
                case 7:
                    _c.sent();
                    chai_1.expect(sandbox.exports).to.equal("aa");
                    return [2 /*return*/];
            }
        });
    }); });
    xit("re-evaluates once if multiple dependencies change at the same time", function () { return __awaiter(_this, void 0, void 0, function () {
        var kernel, sandbox, spy, graph, dep, _a, _b, bdep, cdep, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    kernel = helpers_1.createSandboxTestKernel({
                        mockFiles: {
                            "a.js": "module.exports = require('./b.js')",
                            "b.js": "module.exports = require('./c.js');",
                            "c.js": "module.exports = 'cc';"
                        }
                    });
                    sandbox = new __1.Sandbox(kernel);
                    spy = sinon.spy(sandbox, "reset");
                    graph = __1.DependencyGraphProvider.getInstance({ name: "webpack" }, kernel);
                    _b = (_a = graph).getDependency;
                    return [4 /*yield*/, graph.resolve("a.js", "")];
                case 1: return [4 /*yield*/, _b.apply(_a, [_f.sent()])];
                case 2:
                    dep = _f.sent();
                    return [4 /*yield*/, sandbox.open(dep)];
                case 3:
                    _f.sent();
                    chai_1.expect(sandbox.exports).to.equal("cc");
                    bdep = dep.eagerGetDependency("b.js");
                    cdep = bdep.eagerGetDependency("c.js");
                    _d = (_c = Promise).all;
                    return [4 /*yield*/, bdep.getSourceFileCacheItem()];
                case 4: return [4 /*yield*/, (_f.sent()).setDataUrlContent("module.exports = require('./c.js') + 'b'")];
                case 5:
                    _e = [
                        (_f.sent()).save()
                    ];
                    return [4 /*yield*/, cdep.getSourceFileCacheItem()];
                case 6: return [4 /*yield*/, ((_f.sent()).setDataUrlContent("module.exports = 'ccc'"))];
                case 7: return [4 /*yield*/, _d.apply(_c, [_e.concat([
                            (_f.sent()).save()
                        ])])];
                case 8:
                    _f.sent();
                    return [4 /*yield*/, helpers_1.timeout(10)];
                case 9:
                    _f.sent();
                    chai_1.expect(sandbox.exports).to.equal("cccb");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=core-test.js.map