"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messages_1 = require("../messages");
var index_1 = require("./index");
var chai_1 = require("chai");
var mesh_1 = require("mesh");
describe(__filename + "#", function () {
    it("can be created", function () {
        new index_1.Observable();
    });
    it("can observe the observable for any message", function () {
        var obs = new index_1.Observable();
        var i = 0;
        obs.observe({
            dispatch: function (message) { return i++; }
        });
        obs.notify(new messages_1.CoreEvent("change"));
        chai_1.expect(i).to.equal(1);
    });
    it("can add multiple observers the observable for any message", function () {
        var obs = new index_1.Observable();
        var i = 0;
        obs.observe({
            dispatch: function (message) { return i++; }
        });
        obs.observe({
            dispatch: function (message) { return i++; }
        });
        obs.notify(new messages_1.CoreEvent("change"));
        chai_1.expect(i).to.equal(2);
    });
    it("can immediately stop an message from propagating", function () {
        var obs = new index_1.Observable();
        var i = 0;
        obs.observe({
            dispatch: function (message) { i++; message.stopImmediatePropagation(); }
        });
        obs.observe({
            dispatch: function (message) { return i++; }
        });
        obs.notify(new messages_1.CoreEvent("change"));
        chai_1.expect(i).to.equal(1);
    });
    it("can stop an message from bubbling", function () {
        var obs = new index_1.Observable();
        var i = 0;
        obs.observe({
            dispatch: function (message) {
                if (i > 0)
                    message.stopPropagation();
            }
        });
        var obs2 = new index_1.Observable();
        obs2.observe({
            dispatch: function (message) { return i++; }
        });
        obs.observe({ dispatch: obs2.notify.bind(obs2) });
        obs.notify(new messages_1.CoreEvent("change"));
        chai_1.expect(i).to.equal(1);
        obs.notify(new messages_1.CoreEvent("change"));
        chai_1.expect(i).to.equal(1);
    });
    it("can unobserve an observable", function () {
        var obs = new index_1.Observable();
        var i = 0;
        var observer = new mesh_1.CallbackBus(function () { return i++; });
        obs.observe(observer);
        obs.notify(new messages_1.CoreEvent("a"));
        chai_1.expect(i).to.equal(1);
        obs.unobserve(observer);
        obs.notify(new messages_1.CoreEvent("a"));
        chai_1.expect(i).to.equal(1);
    });
});
//# sourceMappingURL=index-test.js.map