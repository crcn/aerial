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
var chai_1 = require("chai");
var base_1 = require("./base");
describe(__filename + "#", function () {
    describe("Kernel#", function () {
        it("can be created", function () {
            new base_1.Kernel();
        });
        var UndefinedProvider = (function (_super) {
            __extends(UndefinedProvider, _super);
            function UndefinedProvider(ns) {
                return _super.call(this, ns, undefined) || this;
            }
            return UndefinedProvider;
        }(base_1.Provider));
        it("can query for a fragment", function () {
            var ab = new base_1.Provider("a/b", undefined);
            var deps = new base_1.Kernel(ab, new base_1.Provider("c/d", undefined));
            chai_1.expect(deps.query("a/b")).not.to.equal(undefined);
        });
        it("registers deps when calling register()", function () {
            var deps = new base_1.Kernel();
            var ab = new base_1.Provider("a/b", "a");
            deps.register(ab);
            chai_1.expect(deps.query("a/b")).not.to.equal(undefined);
        });
        it("can query for multiple deps that share the same path", function () {
            var deps = new base_1.Kernel(new UndefinedProvider("a/b"), new UndefinedProvider("a/c"), new UndefinedProvider("a/d"), new UndefinedProvider("a/d/e"), new UndefinedProvider("a/d/f"), new UndefinedProvider("b/c"), new UndefinedProvider("b"));
            chai_1.expect(deps.queryAll("a/**").length).to.equal(5);
            chai_1.expect(deps.queryAll("a/d/**").length).to.equal(2); // a/d/e, a/d/f
            chai_1.expect(deps.queryAll("/**").length).to.equal(deps.length);
        });
        it("can create a child fragment with the same deps", function () {
            var deps = new base_1.Kernel(new UndefinedProvider("a/b"), new UndefinedProvider("b/c"));
            var child = deps.clone();
            chai_1.expect(child.length).to.equal(deps.length);
        });
        it("can register multiple deps via register()", function () {
            var deps = new base_1.Kernel();
            deps.register(new UndefinedProvider("a/b"), new UndefinedProvider("b/c"));
            chai_1.expect(deps.length).to.equal(2);
        });
        it("can register nested deps", function () {
            var deps = new base_1.Kernel();
            var de;
            deps.register(new UndefinedProvider("a/b"), new UndefinedProvider("b/c"), [new UndefinedProvider("b/d"), [de = new UndefinedProvider("d/e")]]);
            chai_1.expect(deps.length).to.equal(4);
            chai_1.expect(deps.query("d/e")).not.to.equal(undefined);
        });
    });
});
//# sourceMappingURL=base-test.js.map