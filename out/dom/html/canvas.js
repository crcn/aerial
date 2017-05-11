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
// import Canvas = require("canvas-prebuilt");
var element_1 = require("./element");
var SyntheticHTMLCanvasElement = (function (_super) {
    __extends(SyntheticHTMLCanvasElement, _super);
    function SyntheticHTMLCanvasElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticHTMLCanvasElement.prototype.createdCallback = function () {
        _super.prototype.createdCallback.call(this);
        // default
        this._canvas = {};
    };
    Object.defineProperty(SyntheticHTMLCanvasElement.prototype, "height", {
        get: function () {
            return this._canvas.height;
        },
        set: function (value) {
            this._canvas.height = value;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHTMLCanvasElement.prototype.msToBlob = function () {
        return null;
    };
    SyntheticHTMLCanvasElement.prototype.toDataURL = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = this._canvas).toDataURL.apply(_a, [type].concat(args));
        var _a;
    };
    SyntheticHTMLCanvasElement.prototype.toBlob = function (callback, type) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
    };
    Object.defineProperty(SyntheticHTMLCanvasElement.prototype, "width", {
        get: function () {
            return this._canvas.width;
        },
        set: function (value) {
            this._canvas.width = value;
        },
        enumerable: true,
        configurable: true
    });
    // getContext(contextId: "2d", contextAttributes?: Canvas2DContextAttributes): CanvasRenderingContext2D | null;
    // getContext(contextId: "webgl" | "experimental-webgl", contextAttributes?: WebGLContextAttributes): WebGLRenderingContext | null;
    SyntheticHTMLCanvasElement.prototype.getContext = function (contextId, contextAttributes) {
        // return this._canvas.getContext(contextId, contextAttributes);
        // stub for now
        return {
            clearRect: function () { },
            canvas: { width: 500, height: 500 },
            arc: function () { },
            closePath: function () { },
            fill: function () { },
            beginPath: function () { }
        };
    };
    return SyntheticHTMLCanvasElement;
}(element_1.SyntheticHTMLElement));
exports.SyntheticHTMLCanvasElement = SyntheticHTMLCanvasElement;
//# sourceMappingURL=canvas.js.map