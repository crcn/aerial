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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ent_1 = require("ent");
var base_1 = require("../base");
var dom_1 = require("../../dom");
var common_1 = require("@tandem/common");
var dom_2 = require("../../dom");
var ss = null;
function getHostStylesheets(node) {
    var p = node.parentNode;
    while (p.parentNode)
        p = p.parentNode;
    return p.styleSheets || [];
}
function filterInvalidMediaRules(rules) {
}
var parsePx = function (unit) {
    var v = Number(unit && unit.replace(/[a-z]+/g, "") || 0);
    return isNaN(v) ? 0 : v;
};
var calculateSyntheticBoundingRect = function (style) {
    var width = style.width, height = style.height, left = style.left, top = style.top;
    var lp = parsePx(left);
    var tp = parsePx(top);
    var rp = lp + parsePx(width);
    var bp = tp + parsePx(height);
    return new common_1.BoundingRect(lp, tp, rp, bp);
};
var SyntheticDOMRenderer = (function (_super) {
    __extends(SyntheticDOMRenderer, _super);
    function SyntheticDOMRenderer(_a) {
        var _b = _a === void 0 ? {} : _a, nodeFactory = _b.nodeFactory, getComputedStyle = _b.getComputedStyle, createProxyUrl = _b.createProxyUrl;
        var _this = _super.call(this, nodeFactory) || this;
        _this.onElementChange = function () {
            _this.requestRender();
        };
        _this._createProxyUrl = createProxyUrl;
        _this._getComputedStyle = getComputedStyle || (typeof window !== "undefined" ? window.getComputedStyle.bind(window) : function () { });
        return _this;
    }
    SyntheticDOMRenderer.prototype.createElement = function () {
        var element = this.nodeFactory.createElement("div");
        element.innerHTML = this.createElementInnerHTML();
        return element;
    };
    SyntheticDOMRenderer.prototype.createElementInnerHTML = function () {
        return "<span></span><div></div>";
    };
    SyntheticDOMRenderer.prototype.onDocumentMutationEvent = function (_a) {
        var _this = this;
        var mutation = _a.mutation;
        _super.prototype.onDocumentMutationEvent.call(this, arguments[0]);
        if (dom_2.isDOMNodeMutation(mutation)) {
            var _b = this.getElementDictItem(mutation.target), nativeNode = _b[0], syntheticNode = _b[1];
            var insertChild = function (syntheticNode) {
                return renderHTMLNode(_this.nodeFactory, syntheticNode, _this._elementDictionary, _this.onElementChange, _this._createProxyUrl);
            };
            if (nativeNode) {
                if (dom_2.isDOMElementMutation(mutation)) {
                    new dom_2.DOMElementEditor(nativeNode, insertChild).applyMutations([mutation]);
                }
                else if (dom_2.isDOMContainerMutation(mutation)) {
                    new dom_2.DOMContainerEditor(nativeNode, insertChild).applyMutations([mutation]);
                }
                else if (dom_2.isDOMValueNodeMutation(mutation)) {
                    new dom_2.DOMValueNodeEditor(nativeNode).applyMutations([mutation]);
                }
                if (dom_2.isDOMDocumentMutation(mutation)) {
                    if (mutation.type === dom_2.SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT) {
                        this.removeCSSRules(mutation.child);
                    }
                    else if (mutation.type === dom_2.SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT) {
                        var moveMutation = mutation;
                    }
                    else if (mutation.type === dom_2.SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT) {
                        var insertMutation = mutation;
                        this._registerStyleSheet(insertMutation.child, insertMutation.index);
                    }
                }
            }
        }
        if (dom_2.isCSSMutation(mutation)) {
            var styleSheet = mutation.target instanceof dom_2.SyntheticCSSStyleSheet ? mutation.target : mutation.target.parentStyleSheet;
            var _c = this.getCSSDictItem(styleSheet), nativeRule = _c[0], syntheticRule = _c[1];
            // MUST replace the entire CSS text here since vendor prefixes get stripped out
            // depending on the browser. This is the simplest method for syncing changes.
            if (nativeRule) {
                this.updateCSSRules(nativeRule, styleSheet);
            }
            else {
                // this.logger.warn(`Unable to find matching declaration`);
            }
        }
    };
    SyntheticDOMRenderer.prototype.updateCSSRules = function (staleStyleSheet, syntheticStyleSheet) {
        while (staleStyleSheet.rules.length) {
            staleStyleSheet.deleteRule(0);
        }
        for (var _i = 0, _a = syntheticStyleSheet.cssRules; _i < _a.length; _i++) {
            var rule = _a[_i];
            try {
                staleStyleSheet.insertRule(this.proxyCSSUrls(rule.cssText), staleStyleSheet.cssRules.length);
            }
            catch (e) {
                // browser may throw errors if it cannot parse the rule -- this will
                // happen unsupported vendor prefixes.
            }
        }
    };
    SyntheticDOMRenderer.prototype.proxyCSSUrls = function (text) {
        var _this = this;
        return this._createProxyUrl ? text.replace(/url\((.*?)\)/g, function (match, url) {
            return "url(\"" + _this._createProxyUrl(url).replace(/["']/g, "") + "\")";
        }) : text;
    };
    SyntheticDOMRenderer.prototype.removeCSSRules = function (syntheticStyleSheet) {
        var _a = this.getCSSDictItem(syntheticStyleSheet), nativeRule = _a[0], syntheticRule = _a[1];
        if (!nativeRule)
            return;
        nativeRule.ownerNode.parentNode.removeChild(nativeRule.ownerNode);
        this._cssRuleDictionary[syntheticStyleSheet.uid] = undefined;
    };
    SyntheticDOMRenderer.prototype.getSyntheticStyleSheetIndex = function (styleSheet) {
        return this.document.styleSheets.findIndex(function (ss) { return ss.uid === styleSheet.uid; });
    };
    SyntheticDOMRenderer.prototype.getSyntheticStyleSheet = function (styleSheet) {
        return this.document.styleSheets[this.getSyntheticStyleSheetIndex(styleSheet)];
    };
    SyntheticDOMRenderer.prototype.getNativeRuleIndex = function (index) {
        this.document.styleSheets.slice(index + 1).forEach(function (ss) {
            index += ss.rules.length;
        });
        return index;
    };
    SyntheticDOMRenderer.prototype.getElementDictItem = function (synthetic) {
        return this._elementDictionary && this._elementDictionary[synthetic.uid] || [undefined, undefined];
    };
    SyntheticDOMRenderer.prototype._registerStyleSheet = function (syntheticStyleSheet, index) {
        var _this = this;
        if (index === void 0) { index = Number.MAX_SAFE_INTEGER; }
        var styleElement = this.nodeFactory.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.textContent = syntheticStyleSheet.cssText;
        var styleContainer = this.element.firstChild;
        if (index > styleContainer.childNodes.length) {
            styleContainer.appendChild(styleElement);
        }
        else {
            styleContainer.insertBefore(styleElement, styleContainer.childNodes[index]);
        }
        return new Promise(function (resolve) {
            var tryRegistering = function () {
                _this.tryRegisteringStyleSheet(styleElement, syntheticStyleSheet).then(function () { return resolve(styleElement); }, function () {
                    setTimeout(tryRegistering, 20);
                });
            };
            setImmediate(tryRegistering);
        });
    };
    SyntheticDOMRenderer.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, document, element;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, document = _a.document, element = _a.element;
                        if (!!this._documentElement) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(document.styleSheets.map(function (styleSheet) {
                                return _this._registerStyleSheet(styleSheet);
                            }).concat((new Promise(function (resolve) {
                                _this._documentElement = renderHTMLNode(_this.nodeFactory, document, _this._elementDictionary = {}, _this.onElementChange, _this._createProxyUrl);
                                element.lastChild.appendChild(_this._documentElement);
                                resolve();
                            }))))];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        this.updateRects();
                        return [2 /*return*/];
                }
            });
        });
    };
    SyntheticDOMRenderer.prototype.getCSSDictItem = function (target) {
        return (this._cssRuleDictionary && this._cssRuleDictionary[target.uid]) || [undefined, undefined];
    };
    SyntheticDOMRenderer.prototype.tryRegisteringStyleSheet = function (styleElement, styleSheet) {
        var nativeStyleSheet = Array.prototype.slice.call(getHostStylesheets(styleElement)).find(function (styleSheet) {
            return styleSheet.ownerNode === styleElement;
        });
        if (!nativeStyleSheet) {
            return Promise.reject(new Error("Cannot find native style sheet generated by DOM renderer."));
        }
        this._cssRuleDictionary[styleSheet.uid] = [nativeStyleSheet, styleSheet];
        return Promise.resolve();
    };
    SyntheticDOMRenderer.prototype.reset = function () {
        var _this = this;
        this._documentElement = undefined;
        this._cssRuleDictionary = {};
        this._elementDictionary = {};
        var element = this.element;
        if (element) {
            element.innerHTML = this.createElementInnerHTML();
            element.onclick =
                element.ondblclick =
                    element.onmousedown =
                        element.onmouseenter =
                            element.onmouseleave =
                                element.onmousemove =
                                    element.onmouseout =
                                        element.onmouseover =
                                            element.onmouseup =
                                                element.onmousewheel =
                                                    element.onkeydown =
                                                        element.onkeypress =
                                                            element.onkeyup = function (event) {
                                                                for (var uid in _this._elementDictionary) {
                                                                    var _a = _this._elementDictionary[uid], native = _a[0], synthetic = _a[1];
                                                                    if (native === event.target) {
                                                                        _this.onDOMEvent(synthetic, event);
                                                                    }
                                                                }
                                                            };
        }
    };
    SyntheticDOMRenderer.prototype.onDOMEvent = function (element, event) {
        // TODO - add more data here
        if (event.constructor.name === "MouseEvent") {
            element.dispatchEvent(new dom_2.SyntheticMouseEvent(event.type));
        }
        else if (event.constructor.name === "KeyboardEvent") {
            element.dispatchEvent(new dom_2.SyntheticKeyboardEvent(event.type));
        }
    };
    SyntheticDOMRenderer.prototype.updateRects = function () {
        var syntheticDOMNodesByUID = {};
        var rects = {};
        var styles = {};
        for (var uid in this._elementDictionary) {
            var _a = this._elementDictionary[uid] || [undefined, undefined], native = _a[0], synthetic = _a[1];
            var syntheticNode = synthetic;
            if (syntheticNode && syntheticNode.nodeType === dom_2.DOMNodeType.ELEMENT) {
                var nativeStyle = this._getComputedStyle(native);
                var rect = typeof window !== "undefined" && window["$synthetic"] ? calculateSyntheticBoundingRect(nativeStyle) : common_1.BoundingRect.fromClientRect(native.getBoundingClientRect());
                if (rect.width || rect.height || rect.left || rect.top) {
                    rects[uid] = rect;
                }
                // just attach whatever's returned by the DOM -- don't wrap this in a synthetic, or else
                // there'll be massive performance penalties.
                styles[uid] = nativeStyle;
                syntheticNode.attachNative(native);
            }
        }
        this.setRects(rects, styles);
    };
    return SyntheticDOMRenderer;
}(base_1.BaseRenderer));
exports.SyntheticDOMRenderer = SyntheticDOMRenderer;
function renderHTMLNode(nodeFactory, syntheticNode, dict, onChange, createProxyUrl) {
    switch (syntheticNode.nodeType) {
        case dom_2.DOMNodeType.TEXT:
            var textNode = nodeFactory.createTextNode(ent_1.decode(String(syntheticNode.textContent)));
            dict[syntheticNode.uid] = [textNode, syntheticNode];
            return textNode;
        case dom_2.DOMNodeType.COMMENT:
            var comment = nodeFactory.createComment(syntheticNode.nodeValue);
            return comment;
        case dom_2.DOMNodeType.ELEMENT:
            var syntheticElement = syntheticNode;
            // add a placeholder for these blacklisted elements so that diffing & patching work properly
            if (/^(style|link|script)$/.test(syntheticElement.nodeName))
                return nodeFactory.createTextNode("");
            var element = renderHTMLElement(nodeFactory, syntheticElement.nodeName, syntheticElement, dict, onChange, createProxyUrl);
            element.onload = onChange;
            for (var i = 0, n = syntheticElement.attributes.length; i < n; i++) {
                var syntheticAttribute = syntheticElement.attributes[i];
                if (syntheticAttribute.name === "class") {
                    element.className = syntheticAttribute.value;
                }
                else {
                    // some cases where the attribute name may be invalid - especially as the app is updating
                    // as the user is typing. E.g: <i </body> will be parsed, but will thrown an error since "<" will be
                    // defined as an attribute of <i>
                    try {
                        var value = syntheticAttribute.value;
                        if (createProxyUrl && /src/.test(syntheticAttribute.name)) {
                            value = createProxyUrl(value);
                        }
                        element.setAttribute(syntheticAttribute.name, value);
                    }
                    catch (e) {
                        console.warn(e.stack);
                    }
                }
            }
            return appendChildNodes(nodeFactory, element, syntheticElement.childNodes, dict, onChange, createProxyUrl);
        case dom_2.DOMNodeType.DOCUMENT:
        case dom_2.DOMNodeType.DOCUMENT_FRAGMENT:
            var syntheticContainer = syntheticNode;
            var containerElement = renderHTMLElement(nodeFactory, "span", syntheticContainer, dict, onChange, createProxyUrl);
            return appendChildNodes(nodeFactory, containerElement, syntheticContainer.childNodes, dict, onChange, createProxyUrl);
    }
}
function renderHTMLElement(nodeFactory, tagName, source, dict, onChange, createProxyUrl) {
    if (/^(html|body|head)$/.test(tagName))
        tagName = "div";
    var element = nodeFactory.createElementNS(source.namespaceURI === dom_1.SVG_XMLNS ? dom_1.SVG_XMLNS : dom_1.HTML_XMLNS, tagName);
    if (source.shadowRoot) {
        appendChildNodes(nodeFactory, element.attachShadow({ mode: "open" }), source.shadowRoot.childNodes, dict, onChange, createProxyUrl);
    }
    dict[source.uid] = [element, source];
    return element;
}
function appendChildNodes(nodeFactory, container, syntheticChildNodes, dict, onChange, createProxyUrl) {
    for (var i = 0, n = syntheticChildNodes.length; i < n; i++) {
        var childNode = renderHTMLNode(nodeFactory, syntheticChildNodes[i], dict, onChange, createProxyUrl);
        // ignored
        if (childNode == null)
            continue;
        container.appendChild(childNode);
    }
    return container;
}
//# sourceMappingURL=index.js.map