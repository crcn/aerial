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
var common_1 = require("@tandem/common");
var utils_1 = require("../utils");
var mesh_1 = require("@tandem/mesh");
var messages_1 = require("./messages");
var events_1 = require("../events");
var XMLHttpRequestReadyState;
(function (XMLHttpRequestReadyState) {
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["UNSET"] = 0] = "UNSET";
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["OPENED"] = 1] = "OPENED";
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["HEADERS_RECEIVED"] = 2] = "HEADERS_RECEIVED";
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["LOADING"] = 3] = "LOADING";
    XMLHttpRequestReadyState[XMLHttpRequestReadyState["DONE"] = 4] = "DONE";
})(XMLHttpRequestReadyState = exports.XMLHttpRequestReadyState || (exports.XMLHttpRequestReadyState = {}));
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
var SyntheticXMLHttpRequest = (function (_super) {
    __extends(SyntheticXMLHttpRequest, _super);
    function SyntheticXMLHttpRequest(bus) {
        var _this = _super.call(this) || this;
        _this.bus = bus;
        _this.setReadyState(XMLHttpRequestReadyState.UNSET);
        _this._domListenerMap = new events_1.DOMEventDispatcherMap(_this);
        utils_1.bindDOMEventMethods(["readyStateChange"], _this);
        return _this;
    }
    Object.defineProperty(SyntheticXMLHttpRequest.prototype, "readyState", {
        get: function () {
            return this._readyState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticXMLHttpRequest.prototype, "status", {
        get: function () {
            return this._response && this._response.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticXMLHttpRequest.prototype, "responseType", {
        get: function () {
            return this._response && this._response.headers.contentType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticXMLHttpRequest.prototype, "responseText", {
        get: function () {
            return this._responseData.join("");
        },
        enumerable: true,
        configurable: true
    });
    SyntheticXMLHttpRequest.prototype.addEventListener = function (type, listener) {
        this._domListenerMap.add(type, listener);
    };
    SyntheticXMLHttpRequest.prototype.removeEventListener = function (type, listener) {
        this._domListenerMap.remove(type, listener);
    };
    SyntheticXMLHttpRequest.prototype.overrideMimeType = function (type) {
        this._overrideMimeType = type;
    };
    SyntheticXMLHttpRequest.prototype.open = function (method, url, async) {
        this.setReadyState(XMLHttpRequestReadyState.OPENED);
        this._method = method;
        this._url = url;
        this._async = async;
    };
    SyntheticXMLHttpRequest.prototype.send = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._asyncSend(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SyntheticXMLHttpRequest.prototype.setReadyState = function (state) {
        this._readyState = state;
        this.notify(new events_1.SyntheticDOMEvent("readyStateChange"));
    };
    SyntheticXMLHttpRequest.prototype.abort = function () {
        if (this._output && this.readyState !== XMLHttpRequestReadyState.DONE) {
            this._output.abort("no reason");
        }
    };
    SyntheticXMLHttpRequest.prototype._asyncSend = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.setReadyState(XMLHttpRequestReadyState.LOADING);
                        var headers = {};
                        var request = new messages_1.HTTPRequest(_this._method, _this._url, headers);
                        var duplex = _this.bus.dispatch(request);
                        var responseData = [];
                        _this._output = duplex.writable;
                        duplex.readable.pipeTo(new mesh_1.WritableStream({
                            write: function (chunk) {
                                if (chunk && chunk.type === messages_1.HTTPResponse.HTTP_RESPONSE) {
                                    var response = _this._response = chunk;
                                    _this.setReadyState(XMLHttpRequestReadyState.HEADERS_RECEIVED);
                                }
                                else {
                                    responseData.push(chunk);
                                }
                                // first response must be a header here - TODO
                            },
                            close: function () {
                                _this._responseData = responseData;
                                _this.setReadyState(XMLHttpRequestReadyState.DONE);
                                resolve();
                            },
                            abort: function (reason) {
                            }
                        }));
                    })];
            });
        });
    };
    return SyntheticXMLHttpRequest;
}(common_1.Observable));
__decorate([
    common_1.bindable()
], SyntheticXMLHttpRequest.prototype, "onreadystatechange", void 0);
exports.SyntheticXMLHttpRequest = SyntheticXMLHttpRequest;
//# sourceMappingURL=request.js.map