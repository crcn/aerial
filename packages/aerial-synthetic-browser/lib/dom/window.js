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
var aerial_common_1 = require("aerial-common");
var abab_1 = require("abab");
var constants_1 = require("./constants");
var memoize = require("memoizee");
var url_1 = require("./url");
var nwmatcher = require("nwmatcher");
var blob_1 = require("./blob");
var history_1 = require("./history");
var location_1 = require("../location");
var document_1 = require("./document");
var html_1 = require("./html");
var local_storage_1 = require("./local-storage");
var timers_1 = require("./timers");
var utils_1 = require("./utils");
var markup_1 = require("./markup");
var xhr_1 = require("./xhr");
var css_1 = require("./css");
var aerial_common_2 = require("aerial-common");
var mesh_1 = require("mesh");
var events_1 = require("./events");
var SyntheticNavigator = (function () {
    function SyntheticNavigator() {
        this.appCodeName = "Tandem";
        this.platform = "synthetic";
        this.userAgent = "none";
    }
    return SyntheticNavigator;
}());
exports.SyntheticNavigator = SyntheticNavigator;
var SyntheticConsole = (function () {
    function SyntheticConsole(_logger) {
        this._logger = _logger;
        // Ensure that when the logs get dispatched that they are displayed.
        this._logger.filterable = false;
    }
    SyntheticConsole.prototype.log = function (text) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        (_a = this._logger).debug.apply(_a, [text].concat(rest));
        var _a;
    };
    SyntheticConsole.prototype.info = function (text) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        (_a = this._logger).info.apply(_a, [text].concat(rest));
        var _a;
    };
    SyntheticConsole.prototype.warn = function (text) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        (_a = this._logger).warn.apply(_a, [text].concat(rest));
        var _a;
    };
    SyntheticConsole.prototype.error = function (text) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        (_a = this._logger).error.apply(_a, [text].concat(rest));
        var _a;
    };
    return SyntheticConsole;
}());
exports.SyntheticConsole = SyntheticConsole;
// TODO - register element types from kernel
var SyntheticDOMImplementation = (function () {
    function SyntheticDOMImplementation(_window) {
        this._window = _window;
    }
    SyntheticDOMImplementation.prototype.hasFeature = function (value) {
        return false;
    };
    SyntheticDOMImplementation.prototype.createHTMLDocument = function (title) {
        var document = new document_1.SyntheticDocument(constants_1.HTML_XMLNS, this);
        document.registerElementNS(constants_1.HTML_XMLNS, "default", html_1.SyntheticHTMLElement);
        var documentElement = document.createElement("html");
        // head
        documentElement.appendChild(document.createElement("head"));
        // body
        documentElement.appendChild(document.createElement("body"));
        document.appendChild(documentElement);
        return document;
    };
    return SyntheticDOMImplementation;
}());
exports.SyntheticDOMImplementation = SyntheticDOMImplementation;
var SyntheticWindow = (function (_super) {
    __extends(SyntheticWindow, _super);
    function SyntheticWindow(location, browser, document) {
        var _this = _super.call(this) || this;
        _this.browser = browser;
        _this.navigator = new SyntheticNavigator();
        _this.innerWidth = 0;
        _this.innerHeight = 0;
        _this.Blob = blob_1.Blob;
        _this.URL = url_1.URL;
        _this.btoa = abab_1.btoa;
        _this.$synthetic = true;
        _this.requestAnimationFrame = function (tick) { return setImmediate(tick); };
        /**
         * overridable method that forces the window to wait for any async
         * processing by the loaded application. Useful to ensure that the app is properly
         * hotswapped.
         */
        _this.syntheticDOMReadyCallback = function () {
        };
        _this.onVMLog = function (log) {
            _this.notify(log);
        };
        // ugly method invoked by browser to fire load events
        _this.whenLoaded = memoize(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.syntheticDOMReadyCallback()];
                    case 1:
                        _a.sent();
                        // always comes before load event since DOM_CONTENT_LOADED assumes that assets
                        // such as stylesheets have not yet been loaded in
                        this.notify(new events_1.SyntheticDOMEvent(events_1.DOMEventTypes.DOM_CONTENT_LOADED));
                        // sandbox has already mapped & loaded external dependencies, so go ahead and fire
                        // the DOM events
                        this.notify(new events_1.SyntheticDOMEvent(events_1.DOMEventTypes.LOAD));
                        return [2 /*return*/];
                }
            });
        }); }, { length: 0, async: true });
        var kernel = browser && browser.kernel;
        var bus = kernel && aerial_common_2.PrivateBusProvider.getInstance(kernel) || mesh_1.noopBusInstance;
        // in case proto gets set - don't want the original to get fudged
        // but doesn't work -- element instanceof HTMLElement 
        _this.HTMLElement = html_1.SyntheticHTMLElement;
        _this.Element = markup_1.SyntheticDOMElement;
        var xhrServer = _this._server = new xhr_1.XHRServer(_this);
        _this.WebSocket = (function () {
            function WebSocket() {
            }
            return WebSocket;
        }());
        if (kernel)
            kernel.inject(xhrServer);
        _this.XMLHttpRequest = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super.call(this, xhrServer) || this;
            }
            return class_1;
        }(xhr_1.SyntheticXMLHttpRequest));
        _this.self = _this;
        _this._implementation = new SyntheticDOMImplementation(_this);
        _this._eventListeners = new events_1.DOMEventDispatcherMap(_this);
        _this.localStorage = new local_storage_1.SyntheticLocalStorage();
        _this.document = document || _this._implementation.createHTMLDocument();
        _this.document.$window = _this;
        _this.location = location || new location_1.SyntheticLocation("");
        _this.history = new history_1.SyntheticHistory(_this.location.toString());
        _this.history.$locationWatcher.connect(function (newLocation) {
            // copy props over -- changing the location means a redirect.
            _this.location.$copyPropertiesFromUrl(newLocation.toString());
        });
        new aerial_common_2.PropertyWatcher(_this.location, "href").connect(function (newValue) {
            _this.notify(new events_1.SyntheticDOMEvent(events_1.DOMEventTypes.POP_STATE));
        });
        _this.window = _this;
        _this.console = new SyntheticConsole(new aerial_common_2.Logger(new mesh_1.CallbackBus(_this.onVMLog.bind(_this))));
        var windowTimers = _this._windowTimers = new timers_1.SyntheticWindowTimers();
        _this.setTimeout = windowTimers.setTimeout.bind(windowTimers);
        _this.setInterval = windowTimers.setInterval.bind(windowTimers);
        _this.setImmediate = windowTimers.setImmediate.bind(windowTimers);
        _this.clearTimeout = windowTimers.clearTimeout.bind(windowTimers);
        _this.clearInterval = windowTimers.clearInterval.bind(windowTimers);
        _this.clearImmediate = windowTimers.clearImmediate.bind(windowTimers);
        utils_1.bindDOMNodeEventMethods(_this, events_1.DOMEventTypes.POP_STATE);
        _this.selector = nwmatcher(_this);
        // VERBOSITY = false to prevent breaking on invalid selector rules
        _this.selector.configure({ CACHING: true, VERBOSITY: false });
        return _this;
        // TODO - register selectors that are specific to the web browser
    }
    Object.defineProperty(SyntheticWindow.prototype, "sandbox", {
        get: function () {
            return this.browser && this.browser.sandbox;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticWindow.prototype.getComputedStyle = function (element) {
        var style = new css_1.SyntheticCSSStyle();
        if (element.nodeType !== markup_1.DOMNodeType.ELEMENT)
            return style;
        var copy = function (from) {
            if (from)
                for (var i = 0, n = from.length; i < n; i++) {
                    if (style[from[i]])
                        continue;
                    style[from[i]] = from[from[i]];
                }
        };
        copy(element.style);
        for (var i = this.document.styleSheets.length; i--;) {
            var ss = this.document.styleSheets[i];
            for (var j = ss.cssRules.length; j--;) {
                var rule = ss.cssRules[j];
                if (rule instanceof css_1.SyntheticCSSElementStyleRule) {
                    // may bust if parent is a shadow root
                    try {
                        if (rule.matchesElement(element)) {
                            copy(rule.style);
                        }
                    }
                    catch (e) {
                    }
                }
            }
        }
        style.$updatePropertyIndices();
        return style;
    };
    SyntheticWindow.prototype.addEventListener = function (type, listener) {
        this._eventListeners.add(type, listener);
    };
    SyntheticWindow.prototype.addEvent = function (type, listener) {
        this._eventListeners.add(type, listener);
    };
    SyntheticWindow.prototype.removeEventListener = function (type, listener) {
        this._eventListeners.remove(type, listener);
    };
    Object.defineProperty(SyntheticWindow.prototype, "depth", {
        get: function () {
            var i = 0;
            var c = this;
            while (c) {
                i++;
                c = c.parent;
            }
            return i;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticWindow.prototype.dispose = function () {
        this._windowTimers.dispose();
    };
    Object.defineProperty(SyntheticWindow.prototype, "parent", {
        get: function () {
            return this.browser.parent && this.browser.parent.window && this.browser.parent.window;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticWindow.prototype, "location", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticWindow.prototype, "onload", void 0);
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticWindow.prototype, "onpopstate", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticWindow.prototype, "innerWidth", void 0);
    __decorate([
        aerial_common_1.bindable(true)
    ], SyntheticWindow.prototype, "innerHeight", void 0);
    return SyntheticWindow;
}(aerial_common_2.Observable));
exports.SyntheticWindow = SyntheticWindow;
//# sourceMappingURL=window.js.map