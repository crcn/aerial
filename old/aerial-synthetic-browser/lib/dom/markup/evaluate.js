"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sm = require("source-map");
var parser_1 = require("./parser");
// TODO - this needs to be async
function evaluateMarkup(expression, doc, namespaceURI, module, parentContainer) {
    var source = module && module.source;
    var smg;
    var fileUri;
    if (source) {
        fileUri = source.uri;
        if (source.map) {
            smg = new sm.SourceMapConsumer(source.map);
        }
    }
    var stack = new Error().stack;
    var root = expression;
    function linkSourceInfo(expression, synthetic) {
        synthetic.$module = module;
        var euri = fileUri;
        // may be undefined if setting innerHTML
        var start = parser_1.getHTMLASTNodeLocation(expression) || { line: 1, column: 1 };
        if (smg) {
            var org = smg.originalPositionFor({ line: start.line, column: start.column - 1 });
            start = { line: org.line, column: org.column };
            euri = org.source;
        }
        synthetic.$source = {
            uri: euri,
            start: start
        };
        return synthetic;
    }
    function appendChildNodes(container, expression) {
        for (var i = 0, n = expression.childNodes.length; i < n; i++) {
            var child = evaluateMarkup(expression.childNodes[i], doc, namespaceURI, module, container);
            child.$createdCallback();
        }
    }
    var getAttribute = function (expression, name) {
        var attr = expression.attrs.find(function (attr) { return attr.name === name; });
        return attr && attr.value;
    };
    var map = function (expression) {
        // nothing for now for doc type
        if (expression.nodeName === "#documentType") {
            var node = doc.createTextNode("");
            linkSourceInfo(expression, node);
            parentContainer.appendChild(node);
            return node;
        }
        if (expression.nodeName === "#comment") {
            var node = linkSourceInfo(expression, doc.createComment(expression.data));
            linkSourceInfo(expression, node);
            parentContainer.appendChild(node);
            return node;
        }
        else if (expression.nodeName === "#text") {
            var value = expression.value;
            var isWS = /^[\n\r\t ]+$/.test(value);
            var node = doc.createTextNode(expression.value);
            if (!isWS) {
                linkSourceInfo(expression, node);
                parentContainer.appendChild(node);
            }
            return node;
        }
        else if (expression.nodeName === "#document" || expression.nodeName === "#document-fragment") {
            var container = void 0;
            if (!expression.parentNode && parentContainer) {
                container = parentContainer;
            }
            else {
                container = doc.createDocumentFragment();
                linkSourceInfo(expression, container);
            }
            appendChildNodes(container, expression);
            if (container !== parentContainer) {
                container.$createdCallback();
            }
            return container;
        }
        var elementExpression = expression;
        var xmlns = getAttribute(elementExpression, "xmlns") || namespaceURI || doc.defaultNamespaceURI;
        // bypass $createdCallback executed by document
        var elementClass = doc.$getElementClassNS(xmlns, expression.nodeName);
        var element = new elementClass(xmlns, expression.nodeName);
        element.$setOwnerDocument(doc);
        parentContainer.appendChild(element);
        for (var i = 0, n = elementExpression.attrs.length; i < n; i++) {
            var attributeExpression = elementExpression.attrs[i];
            element.setAttribute(attributeExpression.name, attributeExpression.value);
        }
        linkSourceInfo(expression, element);
        appendChildNodes(element, elementExpression);
        return element;
    };
    return map(expression);
}
exports.evaluateMarkup = evaluateMarkup;
//# sourceMappingURL=evaluate.js.map