"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@tandem/common");
/**
 * Records all HTTP requests - used for inspecting network requests & also
 * watching resources that are dynamically loaded into the virtual machine.
 */
var XHRRecorder = (function () {
    function XHRRecorder(target) {
        this.target = target;
        this.requests = common_1.ObservableCollection.create();
    }
    XHRRecorder.prototype.dispatch = function (request) {
        this.requests.push(request);
        return this.target.dispatch(request);
    };
    return XHRRecorder;
}());
exports.XHRRecorder = XHRRecorder;
//# sourceMappingURL=recorder.js.map