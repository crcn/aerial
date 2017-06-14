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
var lodash_1 = require("lodash");
var aerial_common_1 = require("aerial-common");
var mesh_1 = require("mesh");
var messages_1 = require("../messages");
var aerial_common_2 = require("aerial-common");
// render timeout -- this should be a low number
var REQUEST_UPDATE_TIMEOUT = 5;
var BaseRenderer = (function (_super) {
    __extends(BaseRenderer, _super);
    function BaseRenderer(nodeFactory) {
        var _this = _super.call(this) || this;
        _this.nodeFactory = nodeFactory || (typeof document !== "undefined" ? document : undefined);
        _this._running = false;
        _this._computedStyles = {};
        _this.rectsWatcher = new aerial_common_2.PropertyWatcher(_this, "rects");
        // may be running in a worker. Do not create an element if that's the case.
        if (_this.nodeFactory) {
            _this.element = _this.createElement();
        }
        _this._targetObserver = new mesh_1.CallbackBus(_this.onDocumentEvent.bind(_this));
        return _this;
    }
    Object.defineProperty(BaseRenderer.prototype, "rects", {
        get: function () {
            return this.$rects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseRenderer.prototype, "document", {
        get: function () {
            return this._document;
        },
        set: function (value) {
            if (this._document === value) {
                this.requestRender();
                return;
            }
            if (this._document) {
                this._document.unobserve(this._targetObserver);
            }
            this.reset();
            this._document = value;
            if (!this._document)
                return;
            this._document.observe(this._targetObserver);
            this.requestRender();
        },
        enumerable: true,
        configurable: true
    });
    BaseRenderer.prototype.getAllBoundingRects = function () {
        return lodash_1.values(this.$rects);
    };
    BaseRenderer.prototype.whenRunning = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._running) return [3 /*break*/, 2];
                        return [4 /*yield*/, aerial_common_2.waitForPropertyChange(this, "_running", function (value) { return !!value; })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    BaseRenderer.prototype.whenRendered = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._rendered) return [3 /*break*/, 2];
                        return [4 /*yield*/, aerial_common_2.waitForPropertyChange(this, "_rendered", function (value) { return !!value; })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    BaseRenderer.prototype.start = function () {
        if (this._running)
            return;
        this._running = true;
        this.requestRender();
    };
    BaseRenderer.prototype.stop = function () {
        this._running = false;
    };
    BaseRenderer.prototype.getComputedStyle = function (uid) {
        return this._computedStyles[uid];
    };
    BaseRenderer.prototype.getBoundingRect = function (uid) {
        return (this.$rects && this.$rects[uid]) || new aerial_common_2.BoundingRect(0, 0, 0, 0);
    };
    BaseRenderer.prototype.reset = function () {
    };
    BaseRenderer.prototype.createElement = function () {
        return this.nodeFactory.createElement("div");
    };
    BaseRenderer.prototype.setRects = function (rects, styles) {
        var oldRects = this.$rects;
        this.$rects = rects;
        this._computedStyles = styles;
        this._rendered = true;
        this.notify(new aerial_common_2.PropertyMutation(aerial_common_2.PropertyMutation.PROPERTY_CHANGE, this, "rects", rects, oldRects).toEvent());
        // DEPRECATED
        this.notify(new messages_1.SyntheticRendererEvent(messages_1.SyntheticRendererEvent.UPDATE_RECTANGLES));
    };
    BaseRenderer.prototype.onDocumentEvent = function (event) {
        if (this.element && (event.type === aerial_common_1.MutationEvent.MUTATION)) {
            this.onDocumentMutationEvent(event);
        }
    };
    BaseRenderer.prototype.onDocumentMutationEvent = function (event) {
        this.requestRender();
    };
    BaseRenderer.prototype.requestRender = function () {
        var _this = this;
        if (!this._document)
            return;
        if (this._currentRenderPromise) {
            this._shouldRenderAgain = true;
        }
        return this._currentRenderPromise || (this._currentRenderPromise = new Promise(function (resolve, reject) {
            var done = function () {
                _this._currentRenderPromise = undefined;
            };
            // renderer here doesn't need to be particularly fast since the user
            // doesn't get to interact with visual content. Provide a slowish
            // timeout to ensure that we don't kill CPU from unecessary renders.
            var render = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this._document)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.whenRunning()];
                        case 1:
                            _a.sent();
                            this._shouldRenderAgain = false;
                            this.logger.debug("Rendering synthetic document");
                            return [4 /*yield*/, this.render()];
                        case 2:
                            _a.sent();
                            if (!this._shouldRenderAgain) return [3 /*break*/, 4];
                            this._shouldRenderAgain = false;
                            return [4 /*yield*/, render()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); };
            setTimeout(function () {
                render().then(resolve, reject).then(done, done);
            }, _this.getRequestUpdateTimeout());
        }));
    };
    BaseRenderer.prototype.getRequestUpdateTimeout = function () {
        // OVERRIDE ME - used for dynamic render throttling
        return REQUEST_UPDATE_TIMEOUT;
    };
    __decorate([
        aerial_common_2.bindable()
    ], BaseRenderer.prototype, "_rendered", void 0);
    __decorate([
        aerial_common_2.bindable()
    ], BaseRenderer.prototype, "_running", void 0);
    BaseRenderer = __decorate([
        aerial_common_2.loggable()
    ], BaseRenderer);
    return BaseRenderer;
}(aerial_common_2.Observable));
exports.BaseRenderer = BaseRenderer;
var BaseDecoratorRenderer = (function (_super) {
    __extends(BaseDecoratorRenderer, _super);
    function BaseDecoratorRenderer(_renderer) {
        var _this = _super.call(this) || this;
        _this._renderer = _renderer;
        _renderer.observe(new mesh_1.CallbackBus(_this.onTargetRendererEvent.bind(_this)));
        return _this;
    }
    Object.defineProperty(BaseDecoratorRenderer.prototype, "rects", {
        get: function () {
            return this._renderer.rects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDecoratorRenderer.prototype, "rectsWatcher", {
        get: function () {
            return this._renderer.rectsWatcher;
        },
        enumerable: true,
        configurable: true
    });
    BaseDecoratorRenderer.prototype.getComputedStyle = function (uid) {
        return this._renderer.getComputedStyle(uid);
    };
    BaseDecoratorRenderer.prototype.getBoundingRect = function (uid) {
        return this._renderer.getBoundingRect(uid);
    };
    BaseDecoratorRenderer.prototype.getAllBoundingRects = function () {
        return this._renderer.getAllBoundingRects();
    };
    BaseDecoratorRenderer.prototype.whenRunning = function () {
        return this._renderer.whenRunning();
    };
    BaseDecoratorRenderer.prototype.start = function () {
        this._renderer.start();
    };
    BaseDecoratorRenderer.prototype.stop = function () {
        this._renderer.stop();
    };
    Object.defineProperty(BaseDecoratorRenderer.prototype, "element", {
        get: function () {
            return this._renderer.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDecoratorRenderer.prototype, "document", {
        get: function () {
            return this._renderer.document;
        },
        set: function (value) {
            this._renderer.document = value;
        },
        enumerable: true,
        configurable: true
    });
    BaseDecoratorRenderer.prototype.requestRender = function () {
        return this._renderer.requestRender();
    };
    BaseDecoratorRenderer.prototype.onTargetRendererEvent = function (message) {
        if (message.type === messages_1.SyntheticRendererEvent.UPDATE_RECTANGLES) {
            this.onTargetRendererSetRectangles();
        }
        // bubble up
        this.notify(message);
    };
    BaseDecoratorRenderer.prototype.onTargetRendererSetRectangles = function () {
    };
    return BaseDecoratorRenderer;
}(aerial_common_2.Observable));
exports.BaseDecoratorRenderer = BaseDecoratorRenderer;
var NoopRenderer = (function (_super) {
    __extends(NoopRenderer, _super);
    function NoopRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopRenderer.prototype.getBoundingRect = function () {
        return aerial_common_2.BoundingRect.zeros();
    };
    Object.defineProperty(NoopRenderer.prototype, "rects", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    NoopRenderer.prototype.getEagerComputedStyle = function () {
        return null;
    };
    NoopRenderer.prototype.getAllBoundingRects = function () {
        return [];
    };
    NoopRenderer.prototype.whenRunning = function () {
        return Promise.resolve();
    };
    NoopRenderer.prototype.start = function () { };
    NoopRenderer.prototype.stop = function () { };
    NoopRenderer.prototype.getComputedStyle = function () {
        return null;
    };
    NoopRenderer.prototype.hasLoadedComputedStyle = function () {
        return false;
    };
    NoopRenderer.prototype.render = function () { };
    NoopRenderer.prototype.createElement = function () { return undefined; };
    return NoopRenderer;
}(BaseRenderer));
exports.NoopRenderer = NoopRenderer;
//# sourceMappingURL=base.js.map