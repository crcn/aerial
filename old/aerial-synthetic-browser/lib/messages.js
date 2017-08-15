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
var aerial_common2_1 = require("aerial-common2");
var aerial_common_1 = require("aerial-common");
var DOMNodeEvent = (function (_super) {
    __extends(DOMNodeEvent, _super);
    function DOMNodeEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DOMNodeEvent.DOM_NODE_LOADED = "domNodeLoaded";
    return DOMNodeEvent;
}(aerial_common_1.CoreEvent));
exports.DOMNodeEvent = DOMNodeEvent;
var SyntheticRendererNodeEvent = (function (_super) {
    __extends(SyntheticRendererNodeEvent, _super);
    function SyntheticRendererNodeEvent(element, event) {
        var _this = _super.call(this, SyntheticRendererNodeEvent.NODE_EVENT) || this;
        _this.element = element;
        return _this;
    }
    SyntheticRendererNodeEvent.NODE_EVENT = "nodeEvent";
    return SyntheticRendererNodeEvent;
}(aerial_common_1.CoreEvent));
exports.SyntheticRendererNodeEvent = SyntheticRendererNodeEvent;
var SyntheticRendererEvent = (function (_super) {
    __extends(SyntheticRendererEvent, _super);
    function SyntheticRendererEvent(type) {
        return _super.call(this, type) || this;
    }
    SyntheticRendererEvent.UPDATE_RECTANGLES = "updateRectangles";
    return SyntheticRendererEvent;
}(aerial_common_1.CoreEvent));
exports.SyntheticRendererEvent = SyntheticRendererEvent;
// @serializable("OpenRemoteBrowserRequest")
// export class OpenRemoteBrowserRequest extends CoreEvent {
//   static readonly OPEN_REMOTE_BROWSER = "openRemoteBrowser";
//   constructor(readonly options: SyntheticBrowserOpenOptions) {
//     super(OpenRemoteBrowserRequest.OPEN_REMOTE_BROWSER);
//   }
// }
exports.OPEN_REMOTE_BROWSER = "OPEN_REMOTE_BROWSER";
exports.openRemoteBrowserRequest = aerial_common2_1.publicObject(function (options) { return ({
    type: exports.OPEN_REMOTE_BROWSER,
    options: options
}); });
//# sourceMappingURL=messages.js.map