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
var ReadFileCommand = (function (_super) {
    __extends(ReadFileCommand, _super);
    function ReadFileCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReadFileCommand.prototype.execute = function (_a) {
        var uri = _a.uri;
        var protocol = uri_1.URIProtocolProvider.lookup(uri, this.kernel);
        return protocol.read(uri);
    };
    return ReadFileCommand;
}(aerial_common_1.BaseCommand));
exports.ReadFileCommand = ReadFileCommand;
//# sourceMappingURL=read-file.js.map