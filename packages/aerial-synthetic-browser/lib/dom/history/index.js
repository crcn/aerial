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
var aerial_common_1 = require("aerial-common");
var location_1 = require("../../location");
var SyntheticHistory = (function (_super) {
    __extends(SyntheticHistory, _super);
    function SyntheticHistory(url) {
        var _this = _super.call(this) || this;
        _this._index = 0;
        _this._states = [[{}, undefined, url]];
        _this.$location = new location_1.SyntheticLocation(url);
        _this.$locationWatcher = new aerial_common_1.PropertyWatcher(_this, "$location");
        return _this;
    }
    Object.defineProperty(SyntheticHistory.prototype, "state", {
        get: function () {
            return this._states[this._index][0];
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHistory.prototype.back = function () {
        this.go(--this._index);
    };
    SyntheticHistory.prototype.forward = function () {
        this.go(++this._index);
    };
    SyntheticHistory.prototype.go = function (index) {
        this._index = index;
        this._redirect(this._states[index][2]);
    };
    Object.defineProperty(SyntheticHistory.prototype, "length", {
        get: function () {
            return this._states.length;
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHistory.prototype.pushState = function (state, title, url) {
        this._states.push([state, title, url]);
        this._index = this.length - 1;
        this._redirect(url);
    };
    SyntheticHistory.prototype.replaceState = function (state, title, url) {
        this._states[this.length - 1] = [state, title, url];
        this._index = this.length - 1;
        this._redirect(url);
    };
    SyntheticHistory.prototype._redirect = function (url) {
        var newLocation = this.$location.clone();
        newLocation.$redirect(url);
        this.$location = newLocation;
    };
    __decorate([
        aerial_common_1.bindable()
    ], SyntheticHistory.prototype, "$location", void 0);
    return SyntheticHistory;
}(aerial_common_1.Observable));
exports.SyntheticHistory = SyntheticHistory;
//# sourceMappingURL=index.js.map