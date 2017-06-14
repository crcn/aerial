"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URI_PROTOCOL_ID_REGEX = /^\w+:\/\//;
exports.hasURIProtocol = function (value) { return URI_PROTOCOL_ID_REGEX.test(value); };
exports.removeURIProtocol = function (value) { return value.replace(URI_PROTOCOL_ID_REGEX, ""); };
exports.parseURI = function (value) {
    // if (value.subd)
};
exports.getProtocol = function (value) { return (/^\w+:/.exec(value) || [])[0]; };
function createDataUrl(content, mimeType) {
    if (mimeType === void 0) { mimeType = "text/plain"; }
    if (!(content instanceof Buffer)) {
        content = new Buffer(content, "utf8");
    }
    return "data:" + mimeType + "," + content.toString("base64");
}
exports.createDataUrl = createDataUrl;
//# sourceMappingURL=index.js.map