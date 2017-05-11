"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("./index");
describe(__filename + "#", function () {
    it("can evaluate a hex color", function () {
        var color = index_1.evaluateCSSDeclValue(index_1.parseCSSDeclValue("#F60"))[0];
        chai_1.expect(color).to.be.an.instanceOf(index_1.SyntheticCSSColor);
        chai_1.expect(color.r).to.equal(255);
        chai_1.expect(color.g).to.equal(102);
        chai_1.expect(color.b).to.equal(0);
        chai_1.expect(color.a).to.equal(1);
    });
    it("can evaluate an rgba color", function () {
        var color = index_1.evaluateCSSDeclValue(index_1.parseCSSDeclValue("rgba(255, 0, 255, 0.5)"))[0];
        chai_1.expect(color).to.be.an.instanceOf(index_1.SyntheticCSSColor);
        chai_1.expect(color.r).to.equal(255);
        chai_1.expect(color.g).to.equal(0);
        chai_1.expect(color.b).to.equal(255);
        chai_1.expect(color.a).to.equal(0.5);
    });
    it("can evaluate an rgba color", function () {
        var color = index_1.evaluateCSSDeclValue(index_1.parseCSSDeclValue("rgb(255, 0, 100)"))[0];
        chai_1.expect(color).to.be.an.instanceOf(index_1.SyntheticCSSColor);
        chai_1.expect(color.r).to.equal(255);
        chai_1.expect(color.g).to.equal(0);
        chai_1.expect(color.b).to.equal(100);
        chai_1.expect(color.a).to.equal(1);
    });
    it("can evaluate measurements", function () {
        var measurment = index_1.evaluateCSSDeclValue(index_1.parseCSSDeclValue("1px"))[0];
        chai_1.expect(measurment).to.be.an.instanceOf(index_1.SyntheticCSSMeasurment);
        chai_1.expect(measurment.value).to.equal(1);
        chai_1.expect(measurment.unit).to.equal("px");
    });
    it("can evaluate a space list", function () {
        var _a = index_1.evaluateCSSDeclValue(index_1.parseCSSDeclValue("1px solid black")), thickness = _a[0], style = _a[1], color = _a[2];
        chai_1.expect(thickness).to.be.an.instanceOf(index_1.SyntheticCSSMeasurment);
        chai_1.expect(style).to.equal("solid");
        chai_1.expect(color).to.be.an.instanceOf(index_1.SyntheticCSSColor);
    });
    it("evaluates builtin color aliases", function () {
        for (var colorName in index_1.BUILTIN_CSS_COLOR_MAP) {
            chai_1.expect(index_1.evaluateCSSDeclValue(index_1.parseCSSDeclValue(colorName))[0]).to.be.an.instanceOf(index_1.SyntheticCSSColor);
        }
    });
    it("can evaluate linear gradients without angles", function () {
        var gradient = index_1.evaluateCSSDeclValue(index_1.parseCSSDeclValue("linear-gradient(red, blue)"))[0];
        chai_1.expect(gradient.colorStops[0].color.toHex()).to.equal("#FF0000");
        chai_1.expect(gradient.colorStops[1].color.toHex()).to.equal("#0000FF");
        chai_1.expect(gradient.angle).to.equal(0);
    });
    it("can parse more than two color stops", function () {
        var gradient = index_1.evaluateCSSDeclValue(index_1.parseCSSDeclValue("linear-gradient(red, rgb(0, 255, 0) 50%, blue)"))[0];
        chai_1.expect(gradient.colorStops[0].color.toHex()).to.equal("#FF0000");
        chai_1.expect(gradient.colorStops[1].color.toHex()).to.equal("#00FF00");
        chai_1.expect(gradient.colorStops[1].stop).to.equal(0.5);
        chai_1.expect(gradient.colorStops[2].color.toHex()).to.equal("#0000FF");
        chai_1.expect(gradient.toString()).to.equal("linear-gradient(red, lime 50%, blue)");
    });
    describe("filters", function () {
        it("can evaluate CSS filters", function () {
            for (var _i = 0, CSS_FILTER_TYPES_1 = index_1.CSS_FILTER_TYPES; _i < CSS_FILTER_TYPES_1.length; _i++) {
                var filterType = CSS_FILTER_TYPES_1[_i];
                var filter = index_1.evaluateCSSDeclValue(index_1.parseCSSDeclValue(filterType + "(5px)"))[0];
                chai_1.expect(filter).to.be.an.instanceof(index_1.SyntheticCSSFilter);
            }
        });
    });
});
//# sourceMappingURL=evaluate-test.js.map