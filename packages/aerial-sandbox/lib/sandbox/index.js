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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var vm = require("vm");
var providers_1 = require("./providers");
var aerial_common_1 = require("aerial-common");
var SandboxModule = (function () {
    function SandboxModule(sandbox, source) {
        this.sandbox = sandbox;
        this.source = source;
        this.exports = {};
    }
    Object.defineProperty(SandboxModule.prototype, "uri", {
        get: function () {
            return this.source.uri;
        },
        enumerable: true,
        configurable: true
    });
    return SandboxModule;
}());
exports.SandboxModule = SandboxModule;
/**
 * TODO - consider removing require() statement and using evaluate(bundle) instead
 */
var Sandbox = (function (_super) {
    __extends(Sandbox, _super);
    function Sandbox(_kernel, createGlobal) {
        if (createGlobal === void 0) { createGlobal = function () { }; }
        var _this = _super.call(this) || this;
        _this._kernel = _kernel;
        _this.createGlobal = createGlobal;
        // for logging
        _this._kernel.inject(_this);
        _this._modules = {};
        return _this;
    }
    Sandbox.prototype.pause = function () {
        this._paused = true;
    };
    Sandbox.prototype.resume = function () {
        this._paused = false;
        if (this._shouldEvaluate) {
            this._shouldEvaluate = false;
            this.reset();
        }
    };
    Object.defineProperty(Sandbox.prototype, "vmContext", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sandbox.prototype, "exports", {
        get: function () {
            return this._exports;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sandbox.prototype, "global", {
        get: function () {
            return this._global;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sandbox.prototype, "entry", {
        get: function () {
            return this._entry;
        },
        enumerable: true,
        configurable: true
    });
    Sandbox.prototype.open = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._graphWatcherWatcher) {
                            this._graphWatcherWatcher.dispose();
                        }
                        this._entry = entry;
                        this._graphWatcherWatcher = aerial_common_1.watchProperty(entry.watcher, "status", this.onDependencyGraphStatusChange.bind(this)).trigger();
                        this._entry.load();
                        return [4 /*yield*/, this._entry.watcher.waitForAllDependencies()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sandbox.prototype.onDependencyGraphStatusChange = function (newValue, oldValue) {
        if (newValue.type === aerial_common_1.Status.ERROR || newValue.type === aerial_common_1.Status.LOADING) {
            this.status = newValue;
        }
        else if (newValue.type === aerial_common_1.Status.COMPLETED) {
            this.reset();
        }
    };
    Sandbox.prototype.evaluate = function (dependency) {
        var hash = dependency.hash;
        if (this._modules[dependency.hash]) {
            return this._modules[dependency.hash].exports;
        }
        if (dependency.status.type !== aerial_common_1.Status.COMPLETED) {
            throw new Error("Attempting to evaluate dependency " + hash + " that is not loaded yet.");
        }
        var module = this._modules[hash] = new SandboxModule(this, dependency);
        // TODO - cache evaluator here
        var evaluatorFactoryDepedency = providers_1.SandboxModuleEvaluatorFactoryProvider.find(dependency.type, this._kernel);
        if (!evaluatorFactoryDepedency) {
            // console.log(dependency.so)
            throw new Error("Cannot evaluate " + dependency.uri + ":" + dependency.type + " in sandbox.");
        }
        this.logger.debug("Evaluating", dependency.uri);
        try {
            evaluatorFactoryDepedency.create().evaluate(module);
        }
        catch (e) {
            this.status = new aerial_common_1.Status(aerial_common_1.Status.ERROR, e);
            throw e;
        }
        return this.evaluate(dependency);
    };
    Sandbox.prototype.reset = function () {
        if (this._paused) {
            this._shouldEvaluate = true;
            return;
        }
        try {
            var logTimer = this.logger.startTimer();
            this._shouldEvaluate = false;
            var exports_1 = this._exports;
            var global_1 = this._global;
            // global may have some clean up to do (timers, open connections),
            // so call dispose if the method is available.
            if (global_1 && global_1.dispose)
                global_1.dispose();
            this._global = this.createGlobal() || {};
            this._context = vm.createContext(this._global);
            this.notify(new aerial_common_1.PropertyMutation(aerial_common_1.PropertyMutation.PROPERTY_CHANGE, this, "global", this._global, global_1).toEvent());
            this._modules = {};
            this._exports = this.evaluate(this._entry);
            logTimer.stop("Evaluated " + this._entry.uri);
            this.notify(new aerial_common_1.PropertyMutation(aerial_common_1.PropertyMutation.PROPERTY_CHANGE, this, "exports", this._exports, exports_1).toEvent());
        }
        catch (e) {
            this.status = new aerial_common_1.Status(aerial_common_1.Status.ERROR, e);
            throw e;
        }
        this.status = new aerial_common_1.Status(aerial_common_1.Status.COMPLETED);
    };
    return Sandbox;
}(aerial_common_1.Observable));
__decorate([
    aerial_common_1.bindable(true)
], Sandbox.prototype, "status", void 0);
Sandbox = __decorate([
    aerial_common_1.loggable()
], Sandbox);
exports.Sandbox = Sandbox;
__export(require("./providers"));
__export(require("./utils"));
//# sourceMappingURL=index.js.map