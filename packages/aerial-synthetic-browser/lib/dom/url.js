"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FakeURL = (function () {
    function FakeURL() {
    }
    FakeURL.createObjectURL = function (blob) {
        return "data:" + blob.type + "," + encodeURIComponent(blob.parts.join(""));
    };
    FakeURL.revokeObjectURL = function (url) {
        // do nothing
    };
    return FakeURL;
}());
exports.FakeURL = FakeURL;
exports.URL = typeof window !== "undefined" ? window.URL : FakeURL;
//# sourceMappingURL=url.js.map