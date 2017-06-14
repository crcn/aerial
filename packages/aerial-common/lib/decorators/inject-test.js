"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inject_1 = require("./inject");
var chai_1 = require("chai");
var ioc_1 = require("../ioc");
describe(__filename + "#", function () {
    it("can inject a simple string into a name prop", function () {
        var Person = (function () {
            function Person() {
            }
            return Person;
        }());
        __decorate([
            inject_1.inject("name")
        ], Person.prototype, "name", void 0);
        var kernel = new ioc_1.Kernel(new ioc_1.Provider("name", "bob"), new ioc_1.ClassFactoryProvider("person", Person));
        var personDep = kernel.query("person");
        chai_1.expect(personDep.create().name).to.equal("bob");
    });
    it("can map a dependency value before it's injected", function () {
        var Person = (function () {
            function Person() {
            }
            return Person;
        }());
        __decorate([
            inject_1.inject("name", function (dependency) { return dependency.value.toUpperCase(); })
        ], Person.prototype, "name", void 0);
        var kernel = new ioc_1.Kernel(new ioc_1.Provider("name", "bob"), new ioc_1.ClassFactoryProvider("person", Person));
        var personDep = kernel.query("person");
        chai_1.expect(personDep.create().name).to.equal("BOB");
    });
    it("can inject based on the property name", function () {
        var Person = (function () {
            function Person() {
            }
            Person.prototype.$didInject = function () {
            };
            return Person;
        }());
        __decorate([
            inject_1.inject()
        ], Person.prototype, "name", void 0);
        var kernel = new ioc_1.Kernel(new ioc_1.Provider("name", "joe"), new ioc_1.ClassFactoryProvider("person", Person));
        var personDep = kernel.query("person");
        chai_1.expect(personDep.create().name).to.equal("joe");
    });
});
//# sourceMappingURL=inject-test.js.map