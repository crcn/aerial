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
var vm = require("vm");
var Url = require("url");
var path = require("path");
var location_1 = require("./location");
var dom_1 = require("./dom");
var renderers_1 = require("./renderers");
var aerial_common_1 = require("aerial-common");
var aerial_sandbox_1 = require("aerial-sandbox");
var providers_1 = require("./providers");
var mesh_1 = require("mesh");
var BaseSyntheticBrowser = (function (_super) {
    __extends(BaseSyntheticBrowser, _super);
    function BaseSyntheticBrowser(_kernel, renderer, parent) {
        var _this = _super.call(this) || this;
        _this._kernel = _kernel;
        _this.parent = parent;
        _this.status = new aerial_common_1.Status(aerial_common_1.Status.IDLE);
        _this.uid = aerial_sandbox_1.generateSyntheticUID();
        _kernel.inject(_this);
        _this.statusWatcher = new aerial_common_1.PropertyWatcher(_this, "status");
        _this.logs = aerial_common_1.ObservableCollection.create();
        _this._renderer = _kernel.inject(aerial_common_1.isMaster ? renderer || new renderers_1.SyntheticDOMRenderer() : new renderers_1.NoopRenderer());
        _this._renderer.observe(new mesh_1.CallbackBus(_this.onRendererEvent.bind(_this)));
        _this._documentObserver = new mesh_1.CallbackBus(_this.onDocumentEvent.bind(_this));
        _this._windowObserver = new mesh_1.CallbackBus(_this.onWindowEvent.bind(_this));
        return _this;
    }
    BaseSyntheticBrowser.prototype.$didInject = function () { };
    Object.defineProperty(BaseSyntheticBrowser.prototype, "document", {
        get: function () {
            return this.window && this.window.document;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticBrowser.prototype, "kernel", {
        get: function () {
            return this._kernel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticBrowser.prototype, "location", {
        get: function () {
            return this._location;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticBrowser.prototype, "window", {
        get: function () {
            return this._window;
        },
        enumerable: true,
        configurable: true
    });
    BaseSyntheticBrowser.prototype.onRendererEvent = function (event) {
        this.notify(event); // bubble
    };
    /**
     *
     */
    BaseSyntheticBrowser.prototype.clearLogs = function () {
        this.logs.splice(0, this.logs.length);
    };
    BaseSyntheticBrowser.prototype.onRendererNodeEvent = function (event) {
        // OVERRIDE ME
    };
    BaseSyntheticBrowser.prototype.setWindow = function (value, clearLogs) {
        if (this._window) {
            this._window.document.unobserve(this._documentObserver);
        }
        if (clearLogs !== false) {
            this.clearLogs();
        }
        var oldWindow = this._window;
        this._window = value;
        this._window.observe(this._windowObserver);
        this._renderer.document = value.document;
        this._window.document.observe(this._documentObserver);
        this.notify(new aerial_common_1.PropertyMutation(aerial_common_1.PropertyMutation.PROPERTY_CHANGE, this, "window", value, oldWindow).toEvent());
    };
    /**
     * Adds a log from the current VM. Used particularly for debugging.
     */
    BaseSyntheticBrowser.prototype.addLog = function (log) {
        this.logs.push(log);
        this.notify(log);
    };
    Object.defineProperty(BaseSyntheticBrowser.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSyntheticBrowser.prototype, "openOptions", {
        get: function () {
            return this._openOptions;
        },
        enumerable: true,
        configurable: true
    });
    BaseSyntheticBrowser.prototype.open = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var options2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (JSON.stringify(this._openOptions) === JSON.stringify(options) && this._window) {
                            return [2 /*return*/];
                        }
                        options2 = Object.assign({}, options);
                        if (!aerial_common_1.hasURIProtocol(options2.uri))
                            options2.uri = "file://" + options2.uri;
                        this._openOptions = options;
                        this._location = new location_1.SyntheticLocation(options2.uri);
                        return [4 /*yield*/, this.open2(options2)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseSyntheticBrowser.prototype.onDocumentEvent = function (event) {
        this.notify(event);
    };
    BaseSyntheticBrowser.prototype.onWindowEvent = function (event) {
        if (event.type === aerial_common_1.LogEvent.LOG) {
            this.addLog(event);
        }
        else {
            this.notify(event);
        }
    };
    __decorate([
        aerial_common_1.bindable()
    ], BaseSyntheticBrowser.prototype, "status", void 0);
    BaseSyntheticBrowser = __decorate([
        aerial_common_1.loggable()
    ], BaseSyntheticBrowser);
    return BaseSyntheticBrowser;
}(aerial_common_1.Observable));
exports.BaseSyntheticBrowser = BaseSyntheticBrowser;
var SyntheticBrowser = (function (_super) {
    __extends(SyntheticBrowser, _super);
    function SyntheticBrowser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticBrowser.prototype.$didInject = function () {
        _super.prototype.$didInject.call(this);
        this._sandbox = new aerial_sandbox_1.Sandbox(this._kernel, this.createSandboxGlobals.bind(this));
        aerial_common_1.watchProperty(this._sandbox, "status", this.onSandboxStatusChange.bind(this));
        aerial_common_1.watchProperty(this._sandbox, "exports", this.onSandboxExportsChange.bind(this));
        aerial_common_1.watchProperty(this._sandbox, "global", this.setWindow.bind(this));
    };
    Object.defineProperty(SyntheticBrowser.prototype, "sandbox", {
        get: function () {
            return this._sandbox;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticBrowser.prototype.open2 = function (_a) {
        var uri = _a.uri, dependencyGraphStrategyOptions = _a.dependencyGraphStrategyOptions, injectScript = _a.injectScript;
        return __awaiter(this, void 0, void 0, function () {
            var timerLogger, strategyOptions, uriParts, dirname, graph, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // TODO - setup file protocol specific to this CWD
                        this._script = injectScript;
                        this.logger.info("Opening " + uri + " ...");
                        timerLogger = this.logger.startTimer();
                        strategyOptions = Object.assign({}, dependencyGraphStrategyOptions || {});
                        uriParts = Url.parse(uri);
                        dirname = uriParts.pathname && path.dirname(uriParts.pathname) || ".";
                        strategyOptions.rootDirectoryUri = strategyOptions.rootDirectoryUri || (uriParts.protocol || "file:") + "//" + (uriParts.host || (dirname === "." ? "/" : dirname));
                        graph = this._graph = aerial_sandbox_1.DependencyGraphProvider.getInstance(strategyOptions, this._kernel);
                        _a = this;
                        _c = (_b = graph).getDependency;
                        return [4 /*yield*/, graph.resolve(uri)];
                    case 1: return [4 /*yield*/, _c.apply(_b, [_d.sent()])];
                    case 2:
                        _a._entry = _d.sent();
                        return [4 /*yield*/, this._sandbox.open(this._entry)];
                    case 3:
                        _d.sent();
                        timerLogger.stop("Loaded " + uri);
                        return [2 /*return*/];
                }
            });
        });
    };
    SyntheticBrowser.prototype.onSandboxStatusChange = function (newStatus) {
        if (newStatus.type !== aerial_common_1.Status.COMPLETED) {
            this.status = newStatus.clone();
        }
    };
    Object.defineProperty(SyntheticBrowser.prototype, "document", {
        get: function () {
            return this.window && this.window.document;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticBrowser.prototype.createSandboxGlobals = function () {
        var window = new dom_1.SyntheticWindow(this.location.clone(), this, undefined);
        this._registerElementClasses(window.document);
        Object.assign(window, this._graph.createGlobalContext());
        // user injected script to tweak the state of an app
        this._injectScript(window);
        return window;
    };
    SyntheticBrowser.prototype._injectScript = function (window) {
        if (!this._script)
            return;
        vm.runInNewContext(this._script, window);
    };
    SyntheticBrowser.prototype._registerElementClasses = function (document) {
        for (var _i = 0, _a = providers_1.SyntheticDOMElementClassProvider.findAll(this._kernel); _i < _a.length; _i++) {
            var dependency = _a[_i];
            document.registerElementNS(dependency.xmlns, dependency.tagName, dependency.value);
        }
    };
    SyntheticBrowser.prototype.onSandboxExportsChange = function (exports) {
        return __awaiter(this, void 0, void 0, function () {
            var window, document, exportsElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window = this._sandbox.global;
                        document = window.document;
                        this.logger.debug("Evaluated entry", this.location.toString());
                        try {
                            if (exports.documentElement || exports.createDocumentElement) {
                                document.removeAllChildren();
                                document.appendChild(exports.documentElement || exports.createDocumentElement());
                            }
                            if (exports.bodyElement || exports.createBodyElement) {
                                document.removeAllChildren();
                                document.body.appendChild(exports.bodyElement || exports.createBodyElement());
                            }
                        }
                        catch (e) {
                            this.status = new aerial_common_1.Status(aerial_common_1.Status.ERROR, e);
                            throw e;
                        }
                        // there still maybe async ops that need to be loaded in
                        return [4 /*yield*/, window.whenLoaded()];
                    case 1:
                        // there still maybe async ops that need to be loaded in
                        _a.sent();
                        // quick fix to get synthetic window to fire load events
                        this.status = new aerial_common_1.Status(aerial_common_1.Status.COMPLETED);
                        return [2 /*return*/];
                }
            });
        });
    };
    return SyntheticBrowser;
}(BaseSyntheticBrowser));
exports.SyntheticBrowser = SyntheticBrowser;
//# sourceMappingURL=browser.js.map