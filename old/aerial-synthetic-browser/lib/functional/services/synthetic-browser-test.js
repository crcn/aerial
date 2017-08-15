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
var reducers_1 = require("../reducers");
var lodash_1 = require("lodash");
var mesh_1 = require("mesh");
var state_1 = require("../state");
var synthetic_browser_1 = require("./synthetic-browser");
var aerial_common2_1 = require("aerial-common2");
var test_1 = require("../../test");
var messages_1 = require("../messages");
describe(__filename + "#", function () {
    var initTestService = function (state, mockFiles) {
        if (state === void 0) { state = state_1.createSyntheticBrowser2(); }
        return mesh_1.circular(function (upstream) { return lodash_1.flowRight(aerial_common2_1.initStoreService(state, reducers_1.syntheticBrowserReducer, upstream), synthetic_browser_1.initSyntheticBrowserService(upstream, test_1.createTestKernel({
            sandboxOptions: {
                mockFiles: mockFiles
            }
        }))); });
    };
    var getStoreState = function (dispatch) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mesh_1.readOne(dispatch(aerial_common2_1.getStoreStateAction()))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    it("can open a new synthetic window", function () { return __awaiter(_this, void 0, void 0, function () {
        var initialState, dispatch, state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    initialState = state_1.createSyntheticBrowser2();
                    dispatch = initTestService(initialState, {
                        "test.html": "hello"
                    })(lodash_1.noop);
                    return [4 /*yield*/, mesh_1.readAll(dispatch(messages_1.openSyntheticWindowRequested(initialState.$$id, "file://test.html")))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getStoreState(dispatch)];
                case 2:
                    state = _a.sent();
                    chai_1.expect(state.windows.length).to.to.eql(1);
                    chai_1.expect(state.windows[0].location).to.to.eql("file://test.html");
                    return [2 /*return*/];
            }
        });
    }); });
    it("can close a new synthetic window", function () { return __awaiter(_this, void 0, void 0, function () {
        var initialState, dispatch, state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    initialState = state_1.createSyntheticBrowser2();
                    dispatch = initTestService(initialState, {
                        "test.html": "hello"
                    })(lodash_1.noop);
                    return [4 /*yield*/, mesh_1.readAll(dispatch(messages_1.openSyntheticWindowRequested(initialState.$$id, "file://test.html")))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getStoreState(dispatch)];
                case 2:
                    state = _a.sent();
                    chai_1.expect(state.windows.length).to.to.eql(1);
                    chai_1.expect(state.windows[0].location).to.to.eql("file://test.html");
                    return [4 /*yield*/, mesh_1.readAll(dispatch(messages_1.closeSyntheticWindowRequested(state.windows[0].$$id)))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, getStoreState(dispatch)];
                case 4:
                    state = _a.sent();
                    chai_1.expect(state.windows.length).to.to.eql(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("synchronizes the DOM nodes of the synthetic browser to the state", function () { return __awaiter(_this, void 0, void 0, function () {
        var initialState, dispatch, state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    initialState = state_1.createSyntheticBrowser2();
                    dispatch = initTestService(initialState, {
                        "test.html": "hello"
                    })(lodash_1.noop);
                    return [4 /*yield*/, mesh_1.readAll(dispatch(messages_1.openSyntheticWindowRequested(initialState.$$id, "file://test.html")))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getStoreState(dispatch)];
                case 2:
                    state = _a.sent();
                    chai_1.expect(state.windows.length).to.to.eql(1);
                    return [4 /*yield*/, test_1.timeout(100)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, getStoreState(dispatch)];
                case 4:
                    state = _a.sent();
                    chai_1.expect(test_1.omit$$idDeep(state)).to.eql({
                        "windows": [
                            {
                                "computedStyles": [],
                                "location": "file://test.html",
                                "$$type": "SYNTHETIC_BROWSER_WINDOW",
                                "document": {
                                    "$$type": "DOM_DOCUMENT",
                                    "nodeName": "#document",
                                    "nodeType": 9,
                                    "childNodes": [
                                        {
                                            "$$type": "DOM_ELEMENT",
                                            "nodeName": "html",
                                            "nodeType": 1,
                                            "childNodes": [
                                                {
                                                    "$$type": "DOM_ELEMENT",
                                                    "nodeName": "head",
                                                    "nodeType": 1,
                                                    "childNodes": [],
                                                    "attributes": {}
                                                },
                                                {
                                                    "$$type": "DOM_ELEMENT",
                                                    "nodeName": "body",
                                                    "nodeType": 1,
                                                    "childNodes": [
                                                        {
                                                            "$$type": "DOM_TEXT_NODE",
                                                            "nodeName": "#text",
                                                            "nodeType": 3,
                                                            "childNodes": [],
                                                            "nodeValue": "hello"
                                                        }
                                                    ],
                                                    "attributes": {}
                                                }
                                            ],
                                            "attributes": {}
                                        }
                                    ]
                                }
                            }
                        ],
                        "$$type": "SYNTHETIC_BROWSER"
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=synthetic-browser-test.js.map