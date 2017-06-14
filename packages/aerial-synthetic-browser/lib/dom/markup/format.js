"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function formatMarkupExpression(node, defaultIndentation) {
    if (defaultIndentation === void 0) { defaultIndentation = "  "; }
    var indentation = defaultIndentation;
    function format(current, level) {
        if (level === void 0) { level = 0; }
        function indent() {
            return lodash_1.repeat(indentation, level);
        }
        var mapAttribute = function (_a) {
            var name = _a.name, value = _a.value;
            return " " + name + "=\"" + value + "\"";
        };
        if (current.nodeName === "#documentType") {
            var doctype = current;
            return "<!DOCTYPE " + doctype.name + ">";
        }
        else if (current.nodeName === "#text") {
            var text = current;
            // only ws?
            if (/^[\s\r\n\t]$/.test(text.value))
                return "";
            return indent() + text.value.trim();
        }
        else if (current.nodeName === "#comment") {
            var comment = current;
            return indent() + ("<!--" + comment.data + "-->");
        }
        else if (current.nodeName === "#document" || current.nodeName === "#document-fragment") {
            var fragment = current;
            return fragment.childNodes.map(function (child) { return format(child, level); }).join("\n");
        }
        var element = current;
        var buffer = indent() + ("<" + element.nodeName + element.attrs.map(mapAttribute).join("") + ">");
        if (element.childNodes.length) {
            buffer += "\n" + element.childNodes.map(function (child) { return format(child, level + 1); }).join("\n") + "\n" + indent();
        }
        buffer += "</" + element.nodeName + ">";
        return buffer;
    }
    return format(node, 0);
}
exports.formatMarkupExpression = formatMarkupExpression;
//# sourceMappingURL=format.js.map