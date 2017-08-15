"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FakeBlob = (function () {
    function FakeBlob(parts, _a) {
        var type = _a.type;
        this.parts = parts;
        this.type = type;
    }
    return FakeBlob;
}());
exports.FakeBlob = FakeBlob;
exports.Blob = typeof window !== "undefined" ? window.Blob : FakeBlob;
//# sourceMappingURL=blob.js.map