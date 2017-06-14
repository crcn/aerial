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
// https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
var CSSMediaExpressionKind;
(function (CSSMediaExpressionKind) {
    CSSMediaExpressionKind[CSSMediaExpressionKind["MEDIA_QUERY_LIST"] = 1] = "MEDIA_QUERY_LIST";
    CSSMediaExpressionKind[CSSMediaExpressionKind["MEDIA_QUERY"] = 2] = "MEDIA_QUERY";
    CSSMediaExpressionKind[CSSMediaExpressionKind["FEATURE"] = 3] = "FEATURE";
})(CSSMediaExpressionKind = exports.CSSMediaExpressionKind || (exports.CSSMediaExpressionKind = {}));
var CSSMediaExpression = (function () {
    function CSSMediaExpression(kind, location) {
        this.kind = kind;
        this.location = location;
    }
    return CSSMediaExpression;
}());
exports.CSSMediaExpression = CSSMediaExpression;
var CSSMediaQueryListExpression = (function (_super) {
    __extends(CSSMediaQueryListExpression, _super);
    function CSSMediaQueryListExpression(items, location) {
        var _this = _super.call(this, CSSMediaExpressionKind.MEDIA_QUERY_LIST, location) || this;
        _this.items = items;
        return _this;
    }
    CSSMediaQueryListExpression.prototype.accept = function (visitor) {
        visitor.visitMediaQueryList(this);
    };
    return CSSMediaQueryListExpression;
}(CSSMediaExpression));
exports.CSSMediaQueryListExpression = CSSMediaQueryListExpression;
var CSSMediaQueryExpression = (function (_super) {
    __extends(CSSMediaQueryExpression, _super);
    function CSSMediaQueryExpression(operator, type, features, location) {
        var _this = _super.call(this, CSSMediaExpressionKind.MEDIA_QUERY, location) || this;
        _this.operator = operator;
        _this.type = type;
        _this.features = features;
        return _this;
    }
    CSSMediaQueryExpression.prototype.accept = function (visitor) {
        visitor.visitMediaQuery(this);
    };
    return CSSMediaQueryExpression;
}(CSSMediaExpression));
exports.CSSMediaQueryExpression = CSSMediaQueryExpression;
var CSSMediaFeatureExpression = (function (_super) {
    __extends(CSSMediaFeatureExpression, _super);
    function CSSMediaFeatureExpression(name, value, location) {
        var _this = _super.call(this, CSSMediaExpressionKind.FEATURE, location) || this;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    CSSMediaFeatureExpression.prototype.accept = function (visitor) {
        visitor.visitMediaFeature(this);
    };
    return CSSMediaFeatureExpression;
}(CSSMediaExpression));
exports.CSSMediaFeatureExpression = CSSMediaFeatureExpression;
//# sourceMappingURL=ast.js.map