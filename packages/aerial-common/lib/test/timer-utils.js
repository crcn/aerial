"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("../observable");
exports.waitForPropertyChange = observable_1.waitForPropertyChange;
function timeout(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.timeout = timeout;
//# sourceMappingURL=timer-utils.js.map