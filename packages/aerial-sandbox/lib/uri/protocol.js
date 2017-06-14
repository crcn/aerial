"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common_1 = require("aerial-common");
var URIProtocol = (function () {
    function URIProtocol() {
        this._watchers = {};
    }
    URIProtocol.prototype.watch = function (uri, onChange) {
        var _fileWatcher;
        if (!(_fileWatcher = this._watchers[uri])) {
            _fileWatcher = this._watchers[uri] = {
                listeners: [],
                instance: this.watch2(uri, function () {
                    for (var i = _fileWatcher.listeners.length; i--;) {
                        _fileWatcher.listeners[i]();
                    }
                })
            };
        }
        var listeners = _fileWatcher.listeners, instance = _fileWatcher.instance;
        listeners.push(onChange);
        return {
            dispose: function () {
                var index = listeners.indexOf(onChange);
                if (index === -1)
                    return;
                listeners.splice(index, 1);
                if (listeners.length === 0) {
                    instance.dispose();
                }
            }
        };
    };
    URIProtocol.prototype.removeProtocol = function (uri) {
        return uri.replace(/^\w+:\/\//, "");
    };
    return URIProtocol;
}());
URIProtocol = __decorate([
    aerial_common_1.loggable()
], URIProtocol);
exports.URIProtocol = URIProtocol;
//# sourceMappingURL=protocol.js.map