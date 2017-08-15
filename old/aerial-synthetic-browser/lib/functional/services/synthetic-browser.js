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
var aerial_common_1 = require("aerial-common");
var aerial_sandbox_1 = require("aerial-sandbox");
var mesh_1 = require("mesh");
var browser_1 = require("../../browser");
var providers_1 = require("../../providers");
var state_1 = require("../state");
var aerial_common2_1 = require("aerial-common2");
var messages_1 = require("../messages");
exports.initSyntheticBrowserService = function (upstream, kernel) { return function (downstream) { return mesh_1.parallel((function () {
    var openSyntheticBrowsers = new Map();
    kernel = new aerial_common_1.Kernel(new aerial_common_1.KernelProvider(), new aerial_common_1.PrivateBusProvider(new aerial_common_1.BrokerBus()), aerial_sandbox_1.createSandboxProviders(), providers_1.createSyntheticHTMLProviders(), kernel);
    aerial_sandbox_1.FileCacheProvider.getInstance(kernel).syncWithLocalFiles();
    return aerial_common2_1.whenStoreChanged(function (root) { return root; }, function (_a) {
        var state = _a.payload;
        return __awaiter(_this, void 0, void 0, function () {
            var diffs, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = aerial_common2_1.diffArray;
                        return [4 /*yield*/, mesh_1.readAll(openSyntheticBrowsers.keys())];
                    case 1:
                        diffs = _a.apply(void 0, [_b.sent(), aerial_common2_1.getValuesByType(state, state_1.SYTNTHETIC_BROWSER_WINDOW), function (a, b) { return a.$$id === b.$$id ? 1 : -1; }]);
                        aerial_common2_1.eachArrayValueMutation(diffs, {
                            insert: function (_a) {
                                var value = _a.value, index = _a.index;
                                var browser = new browser_1.SyntheticBrowser(kernel);
                                openSyntheticBrowsers.set(value, browser);
                                observeSyntheticBrowserState(browser, value, upstream);
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
                        return [2 /*return*/];
                }
            });
        });
    });
})()); }; };
var observeSyntheticBrowserState = function (browser, window, upstream) {
    observeSyntheticBrowserDOMState(browser, window, upstream);
};
var observeSyntheticBrowserDOMState = function (browser, state, upstream) {
    var dispatchLegacySyntheticDOMChanged = function (mutation) {
        mesh_1.readAll(upstream(messages_1.legacySyntheticDOMChanged(state.$$id, browser.document, mutation)));
    };
    var onDocumentEvent = function (event) {
        if (event.type === aerial_common_1.MutationEvent.MUTATION) {
            dispatchLegacySyntheticDOMChanged(event.mutation);
        }
    };
    var dispatchTitleChanged = function () {
        var titleEl = browser.document.querySelector("title");
        if (titleEl) {
            console.log(titleEl);
            mesh_1.readAll(upstream(messages_1.syntheticWindowTitleChanged(state.$$id, titleEl.textContent)));
        }
    };
    var onStatusChange = function (status) {
        if (status) {
            if (status.type === aerial_common_1.Status.COMPLETED) {
                browser.document.observe({ dispatch: onDocumentEvent });
                dispatchTitleChanged();
                dispatchLegacySyntheticDOMChanged();
            }
            else if (status.type === aerial_common_1.Status.ERROR) {
                // TODO
            }
        }
    };
    aerial_common_1.watchProperty(browser, "status", onStatusChange);
};
//# sourceMappingURL=synthetic-browser.js.map