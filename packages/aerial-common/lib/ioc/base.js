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
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var assert = require("assert");
var Provider = (function () {
    function Provider(id, value, overridable, priority) {
        if (overridable === void 0) { overridable = true; }
        this.id = id;
        this.value = value;
        this.overridable = overridable;
        this.priority = priority;
    }
    /**
     * Clones the dependency - works with base classes.
     */
    Provider.prototype.clone = function () {
        var constructor = this.constructor;
        var clone = new constructor(this.id, this.value);
        // ns might not match up -- since it's common for constructors
        // to prefix the ns before calling super. This fixes that specific
        // case
        clone.id = this.id;
        clone.value = this.value;
        clone.overridable = this.overridable;
        return clone;
    };
    return Provider;
}());
exports.Provider = Provider;
/**
 * Factory Provider for creating new instances of things
 */
var FactoryProvider = (function (_super) {
    __extends(FactoryProvider, _super);
    function FactoryProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FactoryProvider.prototype.create = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        return this.owner.inject((_a = this.value).create.apply(_a, rest));
        var _a;
    };
    return FactoryProvider;
}(Provider));
exports.FactoryProvider = FactoryProvider;
/**
 * factory Provider for classes
 */
var ClassFactoryProvider = (function (_super) {
    __extends(ClassFactoryProvider, _super);
    function ClassFactoryProvider(id, clazz, priority) {
        var _this = _super.call(this, id, clazz) || this;
        _this.clazz = clazz;
        _this.priority = priority;
        assert(clazz, "Class must be defined for " + id + ".");
        return _this;
    }
    ClassFactoryProvider.prototype.create = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        return this.owner.create(this.clazz, rest);
    };
    return ClassFactoryProvider;
}(Provider));
exports.ClassFactoryProvider = ClassFactoryProvider;
/**
 * Contains a collection of Kernel
 */
var Kernel = (function () {
    function Kernel() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        this._providersByNs = {};
        this.register.apply(this, items);
    }
    Object.defineProperty(Kernel.prototype, "length", {
        /**
         */
        get: function () {
            return this.queryAll("/**").length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Queries for one Provider with the given namespace
     * @param {string} ns namespace to query.
     */
    Kernel.prototype.query = function (ns) {
        return this.queryAll(ns)[0];
    };
    /**
     * queries for all Kernel with the given namespace
     */
    Kernel.prototype.queryAll = function (ns) {
        return (this._providersByNs[ns] || []);
    };
    /**
     */
    Kernel.prototype.link = function (dependency) {
        dependency.owner = this;
        return dependency;
    };
    /**
     */
    Kernel.prototype.clone = function () {
        return new (Kernel.bind.apply(Kernel, [void 0].concat(this.queryAll("/**"))))();
    };
    /**
     */
    Kernel.prototype.inject = function (instance) {
        var values = this.getPropertyValues(instance);
        for (var property in values) {
            instance[property] = values[property];
        }
        if (instance.$didInject) {
            instance.$didInject();
        }
        return instance;
    };
    /**
     */
    Kernel.prototype.create = function (clazz, parameters) {
        var values = this.getPropertyValues(clazz);
        for (var property in values) {
            if (parameters[property] == null) {
                parameters[property] = values[property];
            }
        }
        return this.inject(new (clazz.bind.apply(clazz, [void 0].concat(parameters)))());
    };
    /**
     */
    Kernel.prototype.register = function () {
        var providers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            providers[_i] = arguments[_i];
        }
        var flattenedProviders = lodash_1.flattenDeep(providers);
        for (var _a = 0, flattenedProviders_1 = flattenedProviders; _a < flattenedProviders_1.length; _a++) {
            var dependency = flattenedProviders_1[_a];
            // Kernel collection? Merge it into this one.
            if (dependency instanceof Kernel) {
                this.register.apply(this, dependency.queryAll("/**"));
                continue;
            }
            // need to clone the dependency in casse it's part of any other
            // dependency collection, or even a singleton -- this is particularly required for features
            // such as dependency injection.
            dependency = dependency.clone();
            var existing = void 0;
            // check if the Provider already exists to ensure that there are no collisions
            if (existing = this._providersByNs[dependency.id]) {
                if (!existing[0].overridable) {
                    throw new Error("Provider with namespace \"" + dependency.id + "\" already exists.");
                }
            }
            // ref back so that the dependency can fetch additional information
            // for dependency injection. this line is
            this.link(dependency);
            // the last part of the namespace is the unique id. Example namespaces:
            // entities/text, entitiesControllers/div, components/item
            this._providersByNs[dependency.id] = [dependency];
            // store the Provider in a spot where it can be queried with globs (**).
            // This is much faster than parsing this stuff on the fly when calling query()
            var nsParts = dependency.id.split("/");
            for (var i = 0, n = nsParts.length; i < n; i++) {
                var ns = nsParts.slice(0, i).join("/") + "/**";
                if (!this._providersByNs[ns]) {
                    this._providersByNs[ns] = [];
                }
                this._providersByNs[ns].push(dependency);
                this._providersByNs[ns] = this._providersByNs[ns].sort(function (a, b) {
                    return a.priority === b.priority ? 0 : a.priority > b.priority ? -1 : 1;
                });
            }
        }
        return this;
    };
    Kernel.prototype.getPropertyValues = function (target) {
        var __inject = Reflect.getMetadata("injectProperties", target);
        if (target.$$injected) {
            // console.error(`Ignoring additional dependency injection on ${target.constructor.name}.`);
            return;
        }
        // may bust of the object is sealed
        if (!Object.isSealed(target))
            target.$$injected = true;
        var properties = {};
        if (__inject) {
            for (var property in __inject) {
                var _a = __inject[property], ns = _a[0], map = _a[1];
                var value = void 0;
                if (/\*\*$/.test(ns)) {
                    value = this.queryAll(ns).map(map);
                }
                else {
                    value = this.query(ns);
                    value = value ? map(value) : undefined;
                }
                if (value != null) {
                    properties[property] = value;
                }
                if (process.env.DEBUG && (value == null || value.length === 0)) {
                    console.warn("Cannot inject " + ns + " into " + (target.name || target.constructor.name) + "." + property + " property.");
                }
            }
        }
        return properties;
    };
    return Kernel;
}());
exports.Kernel = Kernel;
//# sourceMappingURL=base.js.map