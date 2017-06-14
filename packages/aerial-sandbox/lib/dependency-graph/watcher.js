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
var mesh_1 = require("mesh");
var aerial_common_1 = require("aerial-common");
var utils_1 = require("./utils");
var RELOAD_TIMEOUT = 1000 * 3;
var DependencyGraphWatcher = (function (_super) {
    __extends(DependencyGraphWatcher, _super);
    function DependencyGraphWatcher(entry) {
        var _this = _super.call(this) || this;
        _this.entry = entry;
        _this.waitForAllDependencies = memoize(function () { return __awaiter(_this, void 0, void 0, function () {
            var deps, loadingDependencies, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.status = new aerial_common_1.Status(aerial_common_1.Status.LOADING);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.entry.load()];
                    case 3:
                        _a.sent();
                        deps = utils_1.flattenDependencies(this.entry);
                        loadingDependencies = deps.filter(function (dep) { return dep.status.type === aerial_common_1.Status.LOADING; });
                        // Break if everything is loaded in the dependency graph starting from this instance.
                        // if there were loading deps, then there may be more imported deps that are being loaded in,
                        // so we'll need to re-traverse the entire DEP graph to ensure that they're checked.
                        if (!loadingDependencies.length)
                            return [3 /*break*/, 5];
                        this.logger.debug("Waiting for " + loadingDependencies.length + " dependencies to load");
                        return [4 /*yield*/, Promise.all(loadingDependencies.map(function (dep) { return dep.load(); }))];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        this.status = new aerial_common_1.Status(aerial_common_1.Status.ERROR, e_1);
                        // watch whatever is currently loaded in
                        this.watchDependencies();
                        throw e_1;
                    case 7:
                        this.watchDependencies();
                        this.status = new aerial_common_1.Status(aerial_common_1.Status.COMPLETED);
                        return [2 /*return*/];
                }
            });
        }); }, { promise: true });
        _this._dependencyObserver = new mesh_1.CallbackBus(_this.onDependencyEvent.bind(_this));
        return _this;
    }
    DependencyGraphWatcher.prototype.dispose = function () {
        this._dependencyObservers.dispose();
        this._dependencyObservers = undefined;
    };
    DependencyGraphWatcher.prototype.watchDependencies = function () {
        var _this = this;
        if (this._dependencyObservers) {
            this._dependencyObservers.dispose();
        }
        this._dependencyObservers = aerial_common_1.DisposableCollection.create();
        var _loop_1 = function (dep) {
            dep.observe(this_1._dependencyObserver);
            this_1._dependencyObservers.push({
                dispose: function () { return dep.unobserve(_this._dependencyObserver); }
            });
        };
        var this_1 = this;
        for (var _i = 0, _a = utils_1.flattenDependencies(this.entry); _i < _a.length; _i++) {
            var dep = _a[_i];
            _loop_1(dep);
        }
    };
    DependencyGraphWatcher.prototype.onDependencyEvent = function (message) {
        if (this.status && this.status.type === aerial_common_1.Status.LOADING)
            return;
        this.waitForAllDependencies["clear"]();
        this.waitForAllDependencies();
    };
    return DependencyGraphWatcher;
}(aerial_common_1.Observable));
__decorate([
    aerial_common_1.bindable(true)
], DependencyGraphWatcher.prototype, "status", void 0);
DependencyGraphWatcher = __decorate([
    aerial_common_1.loggable()
], DependencyGraphWatcher);
exports.DependencyGraphWatcher = DependencyGraphWatcher;
//# sourceMappingURL=watcher.js.map