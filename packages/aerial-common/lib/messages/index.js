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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
__export(require("./base"));
__export(require("./core"));
__export(require("./mutate"));
var ActiveRecordEvent = (function (_super) {
    __extends(ActiveRecordEvent, _super);
    function ActiveRecordEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ActiveRecordEvent;
}(base_1.CoreEvent));
ActiveRecordEvent.ACTIVE_RECORD_DESERIALIZED = "activeRecordDeserialized";
exports.ActiveRecordEvent = ActiveRecordEvent;
//# sourceMappingURL=index.js.map