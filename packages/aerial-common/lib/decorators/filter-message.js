"use strict";
/**
 * Used for actors that need to filter for particular messages. Usage:
 *
 * @filterMessage(sift({ $type: DSEvent }))
 * update(message:UpdateEvent) { }
 */
Object.defineProperty(exports, "__esModule", { value: true });
function filterMessage(filter) {
    return function (proto, name, inf) {
        var oldValue = inf.value;
        inf.value = function (message) {
            if (filter(message)) {
                return oldValue.call(this, message);
            }
        };
    };
}
exports.filterMessage = filterMessage;
;
//# sourceMappingURL=filter-message.js.map