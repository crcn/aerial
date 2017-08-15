"use strict";
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var aerial_common_1 = require("aerial-common");
var aerial_sandbox_1 = require("aerial-sandbox");
var providers_1 = require("../../providers");
var effects_1 = require("redux-saga/effects");
var redux_saga_1 = require("redux-saga");
var browser_1 = require("../../browser");
var state_1 = require("../state");
var actions_1 = require("../actions");
function mainSyntheticBrowserSaga(kernel) {
    return function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.fork(syntheticWindowSaga(kernel))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
}
exports.mainSyntheticBrowserSaga = mainSyntheticBrowserSaga;
function syntheticWindowSaga(kernel) {
    return function () {
        var openSyntheticBrowsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    openSyntheticBrowsers = new Map();
                    kernel = new aerial_common_1.Kernel(kernel, new aerial_common_1.KernelProvider(), new aerial_common_1.PrivateBusProvider(new aerial_common_1.BrokerBus()), aerial_sandbox_1.createSandboxProviders(), providers_1.createSyntheticHTMLProviders());
                    aerial_sandbox_1.FileCacheProvider.getInstance(kernel).syncWithLocalFiles();
                    return [4 /*yield*/, aerial_common2_1.watch(function (root) { return root; }, function (root) {
                            var diffs, forks;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        diffs = aerial_common2_1.diffArray(Array.from(openSyntheticBrowsers.keys()), aerial_common2_1.getValuesByType(root, state_1.SYTNTHETIC_BROWSER_WINDOW), function (a, b) { return a.$$id === b.$$id ? 1 : -1; });
                                        forks = [];
                                        aerial_common2_1.eachArrayValueMutation(diffs, {
                                            insert: function (_a) {
                                                var value = _a.value, index = _a.index;
                                                var browser = new browser_1.SyntheticBrowser(kernel);
                                                openSyntheticBrowsers.set(value, browser);
                                                forks.push(effects_1.spawn(observeSyntheticBrowserState, browser, value));
                                                browser.open({
                                                    uri: value.location
                                                });
                                            },
                                            delete: function (_a) {
                                                var value = _a.value, index = _a.index;
                                                // TODO: need to properly dispose of the synthetic browser -- observers
                                                // are attached to other objects defined in the kernel, so this is a memory
                                                // leak (CC)
                                                openSyntheticBrowsers.delete(value);
                                            },
                                            update: function (_a) {
                                                var index = _a.index, newValue = _a.newValue;
                                            }
                                        });
                                        return [5 /*yield**/, __values(forks)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, true];
                                }
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
}
function observeSyntheticBrowserState(browser, window) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(observeSyntheticBrowserDOMState, browser, window)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function observeSyntheticBrowserDOMState(browser, state) {
    var chan, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                chan = redux_saga_1.eventChannel(function (emit) {
                    var dispatchLegacySyntheticDOMChanged = function (mutation) {
                        emit(actions_1.legacySyntheticDOMChanged(state.$$id, browser.document, mutation));
                    };
                    var dispatchSyntheticDOMMount = function (window, mount) {
                        emit(actions_1.syntheticWindowMountChanged(window.$$id, mount));
                    };
                    var onDocumentEvent = function (event) {
                        if (event.type === aerial_common_1.MutationEvent.MUTATION) {
                            dispatchLegacySyntheticDOMChanged(event.mutation);
                        }
                        ;
                    };
                    var dispatchTitleChanged = function () {
                        var titleEl = browser.document.querySelector("title");
                        emit(actions_1.syntheticWindowTitleChanged(state.$$id, titleEl && titleEl.textContent));
                    };
                    var onStatusChange = function (status) {
                        if (status) {
                            if (status.type === aerial_common_1.Status.COMPLETED) {
                                browser.document.observe({ dispatch: onDocumentEvent });
                                dispatchTitleChanged();
                                dispatchSyntheticDOMMount(state, browser.renderer.element);
                                dispatchLegacySyntheticDOMChanged();
                                // TODO - need to start this after mounted dispatched
                                browser.renderer.start();
                            }
                            else if (status.type === aerial_common_1.Status.ERROR) {
                                // TODO
                            }
                        }
                    };
                    aerial_common_1.watchProperty(browser, "status", onStatusChange);
                    return function () {
                    };
                });
                _b.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 4];
                _a = effects_1.put;
                return [4 /*yield*/, effects_1.take(chan)];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 3:
                _b.sent();
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=index.js.map