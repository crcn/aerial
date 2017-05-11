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
var Url = require("url");
var path = require("path");
var common_1 = require("@tandem/common");
var SyntheticLocation = (function (_super) {
    __extends(SyntheticLocation, _super);
    function SyntheticLocation(urlStr) {
        var _this = _super.call(this) || this;
        _this.href = "";
        _this.hash = "";
        _this.search = "";
        _this.pathname = "";
        _this.port = "";
        _this.hostname = "";
        _this.protocol = "";
        _this._parseHref = function () {
            _this._ignoreRebuild = true;
            var href = _this.href;
            var parts = Url.parse(href);
            for (var key in parts) {
                if (key === "host")
                    continue;
                _this[key] = parts[key] || "";
            }
            _this._ignoreRebuild = false;
        };
        _this._rebuildHref = function () {
            if (_this._ignoreRebuild)
                return;
            _this.href = (_this.protocol ? _this.protocol + "//" : "") +
                _this.host +
                _this.pathname + _this.search +
                (_this.hash && (_this.hash.charAt(0) === "#" ? _this.hash : "#" + _this.hash));
        };
        _this.$copyPropertiesFromUrl(urlStr);
        ["hostname", "pathname", "port", "protocol", "hash", "query"].forEach(function (part) {
            new common_1.PropertyWatcher(_this, part).connect(_this._rebuildHref);
        });
        new common_1.PropertyWatcher(_this, "href").connect(_this._parseHref);
        return _this;
    }
    Object.defineProperty(SyntheticLocation.prototype, "host", {
        get: function () {
            return this.hostname + (this.port && this.port.length ? ":" + this.port : "");
        },
        set: function (value) {
            var _a = (value || ":").split(":"), hostname = _a[0], port = _a[1];
            this._ignoreRebuild = true;
            this.hostname = hostname;
            this._ignoreRebuild = false;
            this.port = port;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticLocation.prototype.toString = function () {
        return this.href;
    };
    SyntheticLocation.prototype.clone = function () {
        return new SyntheticLocation(this.toString());
    };
    SyntheticLocation.prototype.$copyPropertiesFromUrl = function (url) {
        var parts = Url.parse(url);
        for (var part in parts) {
            var value = parts[part];
            if (value)
                this[part] = value;
        }
        ;
        return this;
    };
    SyntheticLocation.prototype.$redirect = function (url) {
        this._ignoreRebuild = true;
        var parts = Url.parse(url);
        if (parts.pathname) {
            this.pathname = parts.pathname.charAt(0) === "/" ? parts.pathname : path.dirname(this.pathname) + "/" + parts.pathname;
        }
        this._ignoreRebuild = false;
        this._rebuildHref();
    };
    return SyntheticLocation;
}(common_1.Observable));
__decorate([
    common_1.bindable()
], SyntheticLocation.prototype, "href", void 0);
__decorate([
    common_1.bindable()
], SyntheticLocation.prototype, "hash", void 0);
__decorate([
    common_1.bindable()
], SyntheticLocation.prototype, "search", void 0);
__decorate([
    common_1.bindable()
], SyntheticLocation.prototype, "pathname", void 0);
__decorate([
    common_1.bindable()
], SyntheticLocation.prototype, "port", void 0);
__decorate([
    common_1.bindable()
], SyntheticLocation.prototype, "hostname", void 0);
__decorate([
    common_1.bindable()
], SyntheticLocation.prototype, "protocol", void 0);
exports.SyntheticLocation = SyntheticLocation;
//# sourceMappingURL=location.js.map