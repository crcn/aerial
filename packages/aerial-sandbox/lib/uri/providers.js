"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _i = 0;
var URIProtocolProvider = (function () {
    function URIProtocolProvider(test, clazz, priority) {
        this.clazz = clazz;
        this.priority = priority;
        this.overridable = true;
        this.test = typeof test === "string" ? (function (name) { return name === test; }) : test;
        this.id = URIProtocolProvider.getId(String(_i++));
    }
    URIProtocolProvider.getId = function (name) {
        return ["protocols", name].join("/");
    };
    URIProtocolProvider.prototype.clone = function () {
        return new URIProtocolProvider(this.test, this.clazz, this.priority);
    };
    Object.defineProperty(URIProtocolProvider.prototype, "value", {
        get: function () {
            return this._value || (this._value = this.owner.inject(new this.clazz()));
        },
        enumerable: true,
        configurable: true
    });
    URIProtocolProvider.lookup = function (uri, kernel) {
        // no protocol - it's a file
        if (uri.indexOf(":") === -1) {
            uri = "file://" + uri;
        }
        var protocolId = uri.split(":")[0];
        var provider = kernel.queryAll(this.getId("**")).find(function (provider) {
            return provider.test(protocolId);
        });
        return provider && provider.value;
    };
    return URIProtocolProvider;
}());
exports.URIProtocolProvider = URIProtocolProvider;
//# sourceMappingURL=providers.js.map