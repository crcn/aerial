"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cluster_1 = require("cluster");
exports.isMaster = cluster_1.isMaster;
var serialize_1 = require("../serialize");
var mesh_1 = require("mesh");
exports.fork = function (family, localBus, env) {
    var remoteBus = new mesh_1.ProxyBus();
    var spawn = function () {
        var worker = cluster_1.fork(env);
        remoteBus.target = exports.createProcessBus(family, worker, localBus);
        worker.on("disconnect", function () {
            remoteBus.target = undefined;
            // add timeout in case the worker is crashing repeatedly
            setTimeout(spawn, 1000);
        });
    };
    spawn();
    return remoteBus;
};
exports.createProcessBus = function (family, proc, target) {
    return new mesh_1.RemoteBus({
        family: family,
        testMessage: mesh_1.filterFamilyMessage,
        adapter: {
            send: function (message) {
                proc.send(message);
            },
            addListener: function (listener) {
                proc.on("message", function (message) {
                    listener(message);
                });
            }
        }
    }, target, { serialize: serialize_1.serialize, deserialize: serialize_1.deserialize });
};
exports.hook = function (family, localBus) {
    if (!process.send)
        return mesh_1.noopBusInstance;
    return exports.createProcessBus(family, process, localBus);
};
//# sourceMappingURL=node.js.map