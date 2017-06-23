"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const aerial_common_1 = require("aerial-common");
class ComponentProvider extends aerial_common_1.Provider {
    constructor(name, value, subClass = ComponentProvider) {
        super(subClass.getId(name), value);
        this.name = name;
    }
    static getId(name) {
        return [this.NS, name].join("/");
    }
    create(props) {
        return React.createElement(this.value, props);
    }
    static findAll(name, kernel) {
        console.log(this.getId);
        return kernel.queryAll(this.getId(name));
    }
    static find(name, kernel) {
        return kernel.query(this.getId(name));
    }
    clone() {
        return new ComponentProvider(this.name, this.value);
    }
}
ComponentProvider.NS = "components";
exports.ComponentProvider = ComponentProvider;
function createComponentGroupProvider(ns, baseClass = ComponentProvider) {
    class SubComponentProvider extends baseClass {
        constructor(name, value) {
            super(name, value, SubComponentProvider);
        }
        static getId(name) {
            return ComponentProvider.getId([ns, name].join("/"));
        }
        clone() {
            return new SubComponentProvider(this.name, this.value);
        }
    }
    SubComponentProvider.SUB_NS = ns;
    return SubComponentProvider;
}
exports.createComponentGroupProvider = createComponentGroupProvider;
function createComponentProvider(name, baseClass = ComponentProvider) {
    class SubComponentProvider extends baseClass {
        constructor(value) {
            super(name, value);
        }
        static create(props, kernel) {
            return this.find(name, kernel).create(props);
        }
        clone() {
            return new RootComponentProvider(this.value);
        }
    }
    SubComponentProvider.NAME = name;
    return SubComponentProvider;
}
exports.createComponentProvider = createComponentProvider;
class RootComponentProvider extends createComponentProvider("root") {
    constructor(value) {
        super(value);
    }
    static create(props, kernel) {
        return this.find(this.NAME, kernel).create(props);
    }
    clone() {
        return new RootComponentProvider(this.value);
    }
}
exports.RootComponentProvider = RootComponentProvider;
exports.EditorComponentProvider = createComponentGroupProvider("editorComponents");
//# sourceMappingURL=index.js.map