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
var CSSDeclValueExpressionKind;
(function (CSSDeclValueExpressionKind) {
    CSSDeclValueExpressionKind[CSSDeclValueExpressionKind["IDENTIFIER"] = 1] = "IDENTIFIER";
    CSSDeclValueExpressionKind[CSSDeclValueExpressionKind["COMMA_LIST"] = 2] = "COMMA_LIST";
    CSSDeclValueExpressionKind[CSSDeclValueExpressionKind["SPACE_LIST"] = 3] = "SPACE_LIST";
    CSSDeclValueExpressionKind[CSSDeclValueExpressionKind["MEASUREMENT"] = 4] = "MEASUREMENT";
    CSSDeclValueExpressionKind[CSSDeclValueExpressionKind["DEGREE"] = 5] = "DEGREE";
    CSSDeclValueExpressionKind[CSSDeclValueExpressionKind["LITERAL"] = 6] = "LITERAL";
    CSSDeclValueExpressionKind[CSSDeclValueExpressionKind["CALL"] = 7] = "CALL";
    CSSDeclValueExpressionKind[CSSDeclValueExpressionKind["COLOR"] = 8] = "COLOR";
    CSSDeclValueExpressionKind[CSSDeclValueExpressionKind["BINARY"] = 9] = "BINARY";
})(CSSDeclValueExpressionKind = exports.CSSDeclValueExpressionKind || (exports.CSSDeclValueExpressionKind = {}));
var CSSDeclValueExpression = (function () {
    function CSSDeclValueExpression(kind, location) {
        this.kind = kind;
        this.location = location;
    }
    return CSSDeclValueExpression;
}());
exports.CSSDeclValueExpression = CSSDeclValueExpression;
var CSSDeclColorExpression = (function (_super) {
    __extends(CSSDeclColorExpression, _super);
    function CSSDeclColorExpression(value, location) {
        var _this = _super.call(this, CSSDeclValueExpressionKind.COLOR, location) || this;
        _this.value = value;
        return _this;
    }
    CSSDeclColorExpression.prototype.accept = function (visitor) {
        return visitor.visitColor(this);
    };
    return CSSDeclColorExpression;
}(CSSDeclValueExpression));
exports.CSSDeclColorExpression = CSSDeclColorExpression;
var CSSDeclIdentifierExpression = (function (_super) {
    __extends(CSSDeclIdentifierExpression, _super);
    function CSSDeclIdentifierExpression(value, location) {
        var _this = _super.call(this, CSSDeclValueExpressionKind.IDENTIFIER, location) || this;
        _this.value = value;
        return _this;
    }
    CSSDeclIdentifierExpression.prototype.accept = function (visitor) {
        return visitor.visitIdentifier(this);
    };
    CSSDeclIdentifierExpression.prototype.toString = function () {
        return this.value;
    };
    return CSSDeclIdentifierExpression;
}(CSSDeclValueExpression));
exports.CSSDeclIdentifierExpression = CSSDeclIdentifierExpression;
var CSSDeclListExpression = (function (_super) {
    __extends(CSSDeclListExpression, _super);
    function CSSDeclListExpression(kind, items, location) {
        var _this = _super.call(this, kind, location) || this;
        _this.items = items;
        return _this;
    }
    return CSSDeclListExpression;
}(CSSDeclValueExpression));
exports.CSSDeclListExpression = CSSDeclListExpression;
var CSSDeclCommaListExpression = (function (_super) {
    __extends(CSSDeclCommaListExpression, _super);
    function CSSDeclCommaListExpression(items, location) {
        return _super.call(this, CSSDeclValueExpressionKind.COMMA_LIST, items, location) || this;
    }
    CSSDeclCommaListExpression.prototype.accept = function (visitor) {
        return visitor.visitCommaList(this);
    };
    return CSSDeclCommaListExpression;
}(CSSDeclListExpression));
exports.CSSDeclCommaListExpression = CSSDeclCommaListExpression;
var CSSDeclSpaceListExpression = (function (_super) {
    __extends(CSSDeclSpaceListExpression, _super);
    function CSSDeclSpaceListExpression(items, location) {
        return _super.call(this, CSSDeclValueExpressionKind.SPACE_LIST, items, location) || this;
    }
    CSSDeclSpaceListExpression.prototype.accept = function (visitor) {
        return visitor.visitSpaceList(this);
    };
    return CSSDeclSpaceListExpression;
}(CSSDeclListExpression));
exports.CSSDeclSpaceListExpression = CSSDeclSpaceListExpression;
var CSSDeclMeasurementExpression = (function (_super) {
    __extends(CSSDeclMeasurementExpression, _super);
    function CSSDeclMeasurementExpression(value, unit, location) {
        var _this = _super.call(this, CSSDeclValueExpressionKind.MEASUREMENT, location) || this;
        _this.value = value;
        _this.unit = unit;
        return _this;
    }
    CSSDeclMeasurementExpression.prototype.accept = function (visitor) {
        return visitor.visitMeasurement(this);
    };
    return CSSDeclMeasurementExpression;
}(CSSDeclValueExpression));
exports.CSSDeclMeasurementExpression = CSSDeclMeasurementExpression;
var CSSDeclDegreeExpression = (function (_super) {
    __extends(CSSDeclDegreeExpression, _super);
    function CSSDeclDegreeExpression(value, location) {
        var _this = _super.call(this, CSSDeclValueExpressionKind.DEGREE, location) || this;
        _this.value = value;
        return _this;
    }
    CSSDeclDegreeExpression.prototype.accept = function (visitor) {
        return visitor.visitDegree(this);
    };
    return CSSDeclDegreeExpression;
}(CSSDeclValueExpression));
exports.CSSDeclDegreeExpression = CSSDeclDegreeExpression;
var CSSDeclLiteralExpression = (function (_super) {
    __extends(CSSDeclLiteralExpression, _super);
    function CSSDeclLiteralExpression(value, location) {
        var _this = _super.call(this, CSSDeclValueExpressionKind.LITERAL, location) || this;
        _this.value = value;
        return _this;
    }
    CSSDeclLiteralExpression.prototype.accept = function (visitor) {
        return visitor.visitLiteral(this);
    };
    return CSSDeclLiteralExpression;
}(CSSDeclValueExpression));
exports.CSSDeclLiteralExpression = CSSDeclLiteralExpression;
var CSSDeclCallExpression = (function (_super) {
    __extends(CSSDeclCallExpression, _super);
    function CSSDeclCallExpression(identifier, params, location) {
        var _this = _super.call(this, CSSDeclValueExpressionKind.CALL, location) || this;
        _this.identifier = identifier;
        _this.params = params;
        return _this;
    }
    CSSDeclCallExpression.prototype.accept = function (visitor) {
        return visitor.visitCall(this);
    };
    return CSSDeclCallExpression;
}(CSSDeclValueExpression));
exports.CSSDeclCallExpression = CSSDeclCallExpression;
//# sourceMappingURL=ast.js.map