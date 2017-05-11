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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@tandem/common");
var DOMNodeEvent = (function (_super) {
    __extends(DOMNodeEvent, _super);
    function DOMNodeEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DOMNodeEvent;
}(common_1.CoreEvent));
DOMNodeEvent.DOM_NODE_LOADED = "domNodeLoaded";
exports.DOMNodeEvent = DOMNodeEvent;
var SyntheticRendererNodeEvent = (function (_super) {
    __extends(SyntheticRendererNodeEvent, _super);
    function SyntheticRendererNodeEvent(element, event) {
        var _this = _super.call(this, SyntheticRendererNodeEvent.NODE_EVENT) || this;
        _this.element = element;
        return _this;
    }
    return SyntheticRendererNodeEvent;
}(common_1.CoreEvent));
SyntheticRendererNodeEvent.NODE_EVENT = "nodeEvent";
exports.SyntheticRendererNodeEvent = SyntheticRendererNodeEvent;
var SyntheticRendererEvent = (function (_super) {
    __extends(SyntheticRendererEvent, _super);
    function SyntheticRendererEvent(type) {
        return _super.call(this, type) || this;
    }
    return SyntheticRendererEvent;
}(common_1.CoreEvent));
SyntheticRendererEvent.UPDATE_RECTANGLES = "updateRectangles";
exports.SyntheticRendererEvent = SyntheticRendererEvent;
var OpenRemoteBrowserRequest = OpenRemoteBrowserRequest_1 = (function (_super) {
    __extends(OpenRemoteBrowserRequest, _super);
    function OpenRemoteBrowserRequest(options) {
        var _this = _super.call(this, OpenRemoteBrowserRequest_1.OPEN_REMOTE_BROWSER) || this;
        _this.options = options;
        return _this;
    }
    return OpenRemoteBrowserRequest;
}(common_1.CoreEvent));
OpenRemoteBrowserRequest.OPEN_REMOTE_BROWSER = "openRemoteBrowser";
OpenRemoteBrowserRequest = OpenRemoteBrowserRequest_1 = __decorate([
    common_1.serializable("OpenRemoteBrowserRequest")
], OpenRemoteBrowserRequest);
exports.OpenRemoteBrowserRequest = OpenRemoteBrowserRequest;
var OpenRemoteBrowserRequest_1;
//# sourceMappingURL=messages.js.map