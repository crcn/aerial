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
Object.defineProperty(exports, "__esModule", { value: true });
var mesh_1 = require("mesh");
var serialize_1 = require("../serialize");
var loadedScripts;
var lastScriptSrc;
exports.isMaster = typeof window !== "undefined";
if (exports.isMaster) {
    loadedScripts = document.querySelectorAll("script");
    lastScriptSrc = loadedScripts.length && loadedScripts[loadedScripts.length - 1].src;
}
var Serializer = (function () {
    function Serializer(clazz, serialize, deserialize) {
        this.serialize = serialize;
        this.deserialize = deserialize;
        this.name = clazz.name;
    }
    return Serializer;
}());
exports.Serializer = Serializer;
var workers = [];
var threadedFunctions = [];
var jobPromises = {};
var currentWorkerIndex = 0;
var cid = 0;
function getNextWorker() {
    return workers.length ? workers[currentWorkerIndex = (currentWorkerIndex + 1) % workers.length] : undefined;
}
function createWorkerBus(family, worker, localBus) {
    return new mesh_1.RemoteBus({
        family: family,
        testMessage: mesh_1.filterFamilyMessage,
        adapter: {
            send: function (message) {
                worker.postMessage(message);
            },
            addListener: function (listener) {
                worker.addEventListener("message", function (message) {
                    listener(message.data);
                });
            }
        }
    }, localBus, { serialize: serialize_1.serialize, deserialize: serialize_1.deserialize });
}
/**
 */
function fork(family, localBus, pathName, argv, env) {
    return createWorkerBus(family, new Worker(pathName || lastScriptSrc), localBus);
}
exports.fork = fork;
/**
 */
function hook(family, localBus) {
    return createWorkerBus(family, self, localBus);
}
exports.hook = hook;
/**
 *
 */
if (exports.isMaster) {
    var KILL_TIMEOUT_1 = 1000 * 60 * 5; // 5 minute
    // worker cleanup
    setInterval(function () {
        for (var cid_1 in jobPromises) {
            var promise = jobPromises[cid_1];
            // may have been deleted -- waiting for GC to kick in
            if (!promise)
                continue;
            if (promise.timestamp < Date.now() - KILL_TIMEOUT_1) {
                console.warn("Killing zombie job: " + cid_1);
                // return Timeout error
                jobPromises[cid_1] = undefined;
                promise.reject(new Error("Timeout"));
            }
        }
    }, 1000 * 10);
}
else if (typeof self !== "undefined") {
    self.addEventListener("message", function (message) {
        return __awaiter(this, void 0, void 0, function () {
            function resolve(data) {
                self.postMessage({ cid: cid, data: data }, undefined);
            }
            function reject(data) {
                self.postMessage({ cid: cid, data: data, error: true }, undefined);
            }
            var _a, cid, index, args, fn;
            return __generator(this, function (_b) {
                _a = message.data, cid = _a.cid, index = _a.index, args = _a.args;
                fn = threadedFunctions[index];
                try {
                    resolve(fn.apply(void 0, args));
                }
                catch (e) {
                    reject({ message: e.message });
                }
                return [2 /*return*/];
            });
        });
    });
}
//# sourceMappingURL=browser.js.map