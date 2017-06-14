"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common_1 = require("aerial-common");
var _i = 0;
var seed = Math.round(Math.random() * 100);
function generateSyntheticUID() {
    // TODO - add seed & platform information here
    return "" + seed + "." + _i++;
}
exports.generateSyntheticUID = generateSyntheticUID;
function syntheticSourceInfoEquals(a, b) {
    return (a == null && b == null) || (a && b && a.kind === b.kind && a.uri === b.uri && aerial_common_1.sourcePositionEquals(a.start, b.start) && aerial_common_1.sourcePositionEquals(a.end, b.end));
}
exports.syntheticSourceInfoEquals = syntheticSourceInfoEquals;
/**
 * Converts the synthetic object into a format that can be transfered over a network.
 */
var SyntheticObjectSerializer = (function () {
    function SyntheticObjectSerializer(childSerializer) {
        this.childSerializer = childSerializer;
    }
    SyntheticObjectSerializer.prototype.serialize = function (value) {
        var source = value.$source && [
            value.$source.uri,
            value.$source.kind,
            value.$source.start.line,
            value.$source.start.column,
            value.$source.end && value.$source.end.line,
            value.$source.end && value.$source.end.column,
        ] || [];
        return [this.childSerializer.serialize(value), source, value.$uid];
    };
    SyntheticObjectSerializer.prototype.deserialize = function (_a, kernel, ctor) {
        var child = _a[0], _b = _a[1], uri = _b[0], kind = _b[1], sline = _b[2], scolumn = _b[3], eline = _b[4], ecolumn = _b[5], uid = _a[2];
        var obj = this.childSerializer.deserialize(child, kernel, ctor);
        obj.$source = sline && {
            uri: uri,
            kind: kind,
            start: {
                line: sline,
                column: scolumn
            },
            end: eline && {
                line: eline,
                column: ecolumn
            }
        };
        obj.$uid = uid;
        return obj;
    };
    return SyntheticObjectSerializer;
}());
exports.SyntheticObjectSerializer = SyntheticObjectSerializer;
//# sourceMappingURL=index.js.map