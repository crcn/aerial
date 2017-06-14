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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var aerial_common_1 = require("aerial-common");
var mesh_memory_ds_1 = require("mesh-memory-ds");
var sandbox_1 = require("aerial-commonjs-extension/lib/sandbox");
var __1 = require("../..");
var MockFilesProvider = (function (_super) {
    __extends(MockFilesProvider, _super);
    function MockFilesProvider(files) {
        return _super.call(this, MockFilesProvider.ID, files) || this;
    }
    return MockFilesProvider;
}(aerial_common_1.Provider));
MockFilesProvider.ID = "mockFiles";
exports.MockFilesProvider = MockFilesProvider;
var MockFileURIProtocol = (function (_super) {
    __extends(MockFileURIProtocol, _super);
    function MockFileURIProtocol() {
        var _this = _super.call(this) || this;
        _this._watchers2 = {};
        return _this;
    }
    MockFileURIProtocol.prototype.fileExists = function (filePath) {
        return Promise.resolve(!!this._mockFiles[this.removeProtocol(filePath)]);
    };
    MockFileURIProtocol.prototype.read = function (uri) {
        var _this = this;
        var filePath = this.removeProtocol(uri);
        // try removing root if not found initially
        var content = this._mockFiles[filePath] || this._mockFiles[filePath.substr(1)];
        return new Promise(function (resolve, reject) {
            // simulated latency
            setTimeout(function () {
                if (content) {
                    resolve({ type: aerial_common_1.MimeTypeProvider.lookup(uri, _this._kernel), content: content });
                }
                else {
                    reject(new Error("Mock file " + uri + " not found."));
                }
            }, 5);
        });
    };
    MockFileURIProtocol.prototype.write = function (uri, content) {
        var filePath = this.removeProtocol(uri);
        this._mockFiles[filePath] = content;
        if (this._watchers2[filePath]) {
            this._watchers2[filePath]();
        }
        return Promise.resolve();
    };
    MockFileURIProtocol.prototype.watch2 = function (uri, onChange) {
        var _this = this;
        var filePath = this.removeProtocol(uri);
        this._watchers2[filePath] = onChange;
        return {
            dispose: function () {
                _this._watchers2[filePath] = undefined;
            }
        };
    };
    return MockFileURIProtocol;
}(__1.URIProtocol));
__decorate([
    aerial_common_1.inject(MockFilesProvider.ID)
], MockFileURIProtocol.prototype, "_mockFiles", void 0);
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], MockFileURIProtocol.prototype, "_kernel", void 0);
exports.MockFileURIProtocol = MockFileURIProtocol;
var MockFileResolver = (function () {
    function MockFileResolver() {
    }
    MockFileResolver.prototype.resolve = function (relativePath, origin) {
        var _this = this;
        // http url or something other than file
        if (/^\w+:\/\//.test(relativePath) && relativePath.indexOf("file://") !== 0) {
            return Promise.resolve(relativePath);
        }
        relativePath = relativePath.replace("file://", "");
        return Promise.resolve([
            path.resolve(origin || "", relativePath),
            path.join("", relativePath)
        ].find(function (filePath) { return !!_this._mockFiles[filePath]; }));
    };
    return MockFileResolver;
}());
__decorate([
    aerial_common_1.inject(MockFilesProvider.ID)
], MockFileResolver.prototype, "_mockFiles", void 0);
exports.MockFileResolver = MockFileResolver;
exports.timeout = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
exports.createTestSandboxProviders = function (options) {
    if (options === void 0) { options = {}; }
    return [
        new MockFilesProvider(options.mockFiles || {}),
        __1.createSandboxProviders(MockFileResolver),
        new __1.URIProtocolProvider("file", MockFileURIProtocol, Infinity)
    ];
};
exports.createSandboxTestKernel = function (options) {
    if (options === void 0) { options = {}; }
    var kernel = new aerial_common_1.Kernel();
    var bus = new aerial_common_1.BrokerBus();
    bus.register(new aerial_common_1.UpsertBus(new mesh_memory_ds_1.MemoryDataStore()));
    kernel.register(options.providers || [], new aerial_common_1.KernelProvider(), new aerial_common_1.PrivateBusProvider(bus), sandbox_1.createJavaScriptSandboxProviders(), exports.createTestSandboxProviders(options));
    if (options.fileCacheSync !== false) {
        __1.FileCacheProvider.getInstance(kernel).syncWithLocalFiles();
    }
    return kernel;
};
exports.createTestDependencyGraph = function (graphOptions, kernelOptions) {
    var kernel = exports.createSandboxTestKernel(kernelOptions);
    return __1.DependencyGraphProvider.getInstance(graphOptions, kernel);
};
exports.evaluateDependency = function (dependency) { return __awaiter(_this, void 0, void 0, function () {
    var sandbox;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sandbox = new __1.Sandbox(dependency["_kernel"]);
                return [4 /*yield*/, sandbox.open(dependency)];
            case 1:
                _a.sent();
                return [2 /*return*/, sandbox.exports];
        }
    });
}); };
//# sourceMappingURL=index.js.map