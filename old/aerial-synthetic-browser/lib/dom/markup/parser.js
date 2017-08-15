"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHTMLASTNodeLocation = function (expression) {
    var loc = expression.__location;
    if (!loc)
        return undefined;
    if (loc.startTag) {
        return { line: loc.startTag.line, column: loc.startTag.col };
    }
    else {
        return { line: loc.line, column: loc.col };
    }
};
function traverseDOMNodeExpression(target, each) {
    if (target.nodeName === "#document" || target.nodeName === "#document-fragment") {
    }
    for (var _i = 0, _a = target["childNodes"] || []; _i < _a.length; _i++) {
        var child = _a[_i];
        if (each(child) === false)
            return;
        traverseDOMNodeExpression(child, each);
    }
}
exports.traverseDOMNodeExpression = traverseDOMNodeExpression;
function findDOMNodeExpression(target, filter) {
    var found;
    traverseDOMNodeExpression(target, function (expression) {
        if (filter(expression)) {
            found = expression;
            return false;
        }
    });
    return found;
}
exports.findDOMNodeExpression = findDOMNodeExpression;
function filterDOMNodeExpressions(target, filter) {
    var found = [];
    traverseDOMNodeExpression(target, function (expression) {
        if (filter(expression)) {
            found.push(expression);
        }
    });
    return found;
}
exports.filterDOMNodeExpressions = filterDOMNodeExpressions;
//# sourceMappingURL=parser.js.map