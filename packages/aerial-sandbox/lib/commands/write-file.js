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
var aerial_common_1 = require("aerial-common");
var uri_1 = require("../uri");
var WriteFileCommand = (function (_super) {
    __extends(WriteFileCommand, _super);
    function WriteFileCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WriteFileCommand.prototype.execute = function (_a) {
        var uri = _a.uri, content = _a.content, options = _a.options;
        var protocol = uri_1.URIProtocolProvider.lookup(uri, this.kernel);
        return protocol.write(uri, content, options);
    };
    return WriteFileCommand;
}(aerial_common_1.BaseCommand));
exports.WriteFileCommand = WriteFileCommand;
//# sourceMappingURL=write-file.js.map