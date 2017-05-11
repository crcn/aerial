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
var mesh_1 = require("@tandem/mesh");
var index_1 = require("./index");
describe(__filename + "#", function () {
    var createStubbedSyntheticXMLHttpRequest = function (requests, response) {
        var chunks = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            chunks[_i - 2] = arguments[_i];
        }
        return new index_1.SyntheticXMLHttpRequest(new mesh_1.CallbackDispatcher(function (request) {
            requests.push(request);
            return new mesh_1.DuplexStream(function (input, output) {
                var writer = output.getWriter();
                if (response)
                    writer.write(response);
                chunks.forEach(function (chunk) {
                    writer.write(chunk);
                });
                writer.close();
            });
        }));
    };
    it("can be created", function () {
        new index_1.SyntheticXMLHttpRequest(new mesh_1.SequenceBus([]));
    });
    it("can send a basic HTTP request", function () { return __awaiter(_this, void 0, void 0, function () {
        var requests, xhr, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requests = [];
                    xhr = createStubbedSyntheticXMLHttpRequest(requests);
                    xhr.open("GET", "hello.txt");
                    return [4 /*yield*/, xhr.send()];
                case 1:
                    _a.sent();
                    request = requests[0];
                    chai_1.expect(request.method).to.equal("GET");
                    chai_1.expect(request.url).to.equal("hello.txt");
                    return [2 /*return*/];
            }
        });
    }); });
    it("ready state is UNSET when initialized", function () { return __awaiter(_this, void 0, void 0, function () {
        var requests, xhr;
        return __generator(this, function (_a) {
            requests = [];
            xhr = createStubbedSyntheticXMLHttpRequest(requests);
            chai_1.expect(xhr.readyState).to.equal(index_1.XMLHttpRequestReadyState.UNSET);
            return [2 /*return*/];
        });
    }); });
    it("ready state is OPEN when opened", function () { return __awaiter(_this, void 0, void 0, function () {
        var requests, xhr;
        return __generator(this, function (_a) {
            requests = [];
            xhr = createStubbedSyntheticXMLHttpRequest(requests);
            xhr.open("GET", "something");
            chai_1.expect(xhr.readyState).to.equal(index_1.XMLHttpRequestReadyState.OPENED);
            return [2 /*return*/];
        });
    }); });
    it("goes through all HTTP ready states in the right order", function () { return __awaiter(_this, void 0, void 0, function () {
        var requests, xhr, readyStates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requests = [];
                    xhr = createStubbedSyntheticXMLHttpRequest(requests);
                    readyStates = [];
                    xhr.onreadystatechange = function () { return readyStates.push(xhr.readyState); };
                    xhr.open("GET", "hello.txt");
                    return [4 /*yield*/, xhr.send()];
                case 1:
                    _a.sent();
                    // skip headers received for now since the stub handler returns no message
                    chai_1.expect(readyStates).to.eql([index_1.XMLHttpRequestReadyState.OPENED, index_1.XMLHttpRequestReadyState.LOADING, index_1.XMLHttpRequestReadyState.DONE]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("sets ready state to HEADERS_RECEIVED when headers are returned", function () { return __awaiter(_this, void 0, void 0, function () {
        var xhr, readyStates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xhr = createStubbedSyntheticXMLHttpRequest([], new index_1.HTTPResponse(400));
                    xhr.open("GET", "hello.txt");
                    readyStates = [];
                    xhr.onreadystatechange = function () { return readyStates.push(xhr.readyState); };
                    return [4 /*yield*/, xhr.send()];
                case 1:
                    _a.sent();
                    chai_1.expect(readyStates).to.contain(index_1.XMLHttpRequestReadyState.HEADERS_RECEIVED);
                    return [2 /*return*/];
            }
        });
    }); });
    it("sets the status property based on the response", function () { return __awaiter(_this, void 0, void 0, function () {
        var xhr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xhr = createStubbedSyntheticXMLHttpRequest([], new index_1.HTTPResponse(200));
                    xhr.open("GET", "hello.txt");
                    return [4 /*yield*/, xhr.send()];
                case 1:
                    _a.sent();
                    chai_1.expect(xhr.status).to.equal(200);
                    xhr = createStubbedSyntheticXMLHttpRequest([], new index_1.HTTPResponse(400));
                    xhr.open("GET", "hello.txt");
                    return [4 /*yield*/, xhr.send()];
                case 2:
                    _a.sent();
                    chai_1.expect(xhr.status).to.equal(400);
                    return [2 /*return*/];
            }
        });
    }); });
    it("sets the responseText after loading", function () { return __awaiter(_this, void 0, void 0, function () {
        var xhr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xhr = createStubbedSyntheticXMLHttpRequest([], new index_1.HTTPResponse(200, { contentType: "text/plain" }), "a", "b", "c");
                    xhr.open("GET", "hello.txt");
                    return [4 /*yield*/, xhr.send()];
                case 1:
                    _a.sent();
                    chai_1.expect(xhr.status).to.equal(200);
                    chai_1.expect(xhr.responseText).to.equal("abc");
                    chai_1.expect(xhr.responseType).to.equal("text/plain");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=request-test.js.map