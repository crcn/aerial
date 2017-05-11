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
var sandbox_1 = require("@tandem/sandbox");
var common_1 = require("@tandem/common");
var dom_1 = require("./dom");
var sandbox_2 = require("./sandbox");
var SyntheticDOMElementClassProvider = (function (_super) {
    __extends(SyntheticDOMElementClassProvider, _super);
    function SyntheticDOMElementClassProvider(xmlns, tagName, value) {
        var _this = _super.call(this, SyntheticDOMElementClassProvider.getNamespace(xmlns, tagName), value) || this;
        _this.xmlns = xmlns;
        _this.tagName = tagName;
        return _this;
    }
    SyntheticDOMElementClassProvider.prototype.clone = function () {
        return new SyntheticDOMElementClassProvider(this.xmlns, this.tagName, this.value);
    };
    SyntheticDOMElementClassProvider.getNamespace = function (xmlns, tagName) {
        return [this.SYNTHETIC_ELEMENT_CLASS_NS, encodeURIComponent(xmlns), tagName].join("/");
    };
    SyntheticDOMElementClassProvider.findAll = function (kernel) {
        return kernel.queryAll([this.SYNTHETIC_ELEMENT_CLASS_NS, "**"].join("/"));
    };
    return SyntheticDOMElementClassProvider;
}(common_1.Provider));
SyntheticDOMElementClassProvider.SYNTHETIC_ELEMENT_CLASS_NS = "syntheticMarkupElementClass";
exports.SyntheticDOMElementClassProvider = SyntheticDOMElementClassProvider;
var MarkupMimeTypeXMLNSProvider = (function (_super) {
    __extends(MarkupMimeTypeXMLNSProvider, _super);
    function MarkupMimeTypeXMLNSProvider(mimeType, xmlns) {
        var _this = _super.call(this, MarkupMimeTypeXMLNSProvider.getNamespace(mimeType), xmlns) || this;
        _this.mimeType = mimeType;
        _this.xmlns = xmlns;
        return _this;
    }
    MarkupMimeTypeXMLNSProvider.getNamespace = function (mimeType) {
        return [this.MARKUP_MIME_TYPE_XMLNS, mimeType].join("/");
    };
    MarkupMimeTypeXMLNSProvider.lookup = function (path, kernel) {
        var mimeType = common_1.MimeTypeProvider.lookup(path, kernel);
        var provider = kernel.query(this.getNamespace(mimeType));
        return provider && provider.value;
    };
    return MarkupMimeTypeXMLNSProvider;
}(common_1.Provider));
MarkupMimeTypeXMLNSProvider.MARKUP_MIME_TYPE_XMLNS = "markupMimeTypeXMLNS";
exports.MarkupMimeTypeXMLNSProvider = MarkupMimeTypeXMLNSProvider;
var ElementTextContentMimeTypeProvider = (function (_super) {
    __extends(ElementTextContentMimeTypeProvider, _super);
    function ElementTextContentMimeTypeProvider(tagName, getter) {
        var _this = _super.call(this, ElementTextContentMimeTypeProvider.getId(tagName.toLowerCase()), getter) || this;
        _this.tagName = tagName;
        _this.getter = getter;
        return _this;
    }
    ElementTextContentMimeTypeProvider.prototype.clone = function () {
        return new ElementTextContentMimeTypeProvider(this.tagName, this.getter);
    };
    ElementTextContentMimeTypeProvider.getId = function (tagName) {
        return [this.NS, tagName].join("/");
    };
    ElementTextContentMimeTypeProvider.lookup = function (element, kernel) {
        var provider = kernel.query(this.getId(element.nodeName.toLowerCase()));
        return provider && provider.getter(element);
    };
    return ElementTextContentMimeTypeProvider;
}(common_1.Provider));
ElementTextContentMimeTypeProvider.NS = "elementTextContentMimeTypes";
exports.ElementTextContentMimeTypeProvider = ElementTextContentMimeTypeProvider;
var LoadableElementProvider = (function (_super) {
    __extends(LoadableElementProvider, _super);
    function LoadableElementProvider(tagName) {
        var _this = _super.call(this, LoadableElementProvider.getId(tagName), true) || this;
        _this.tagName = tagName;
        return _this;
    }
    LoadableElementProvider.getId = function (tagName) {
        return [this.NS, tagName].join("/");
    };
    LoadableElementProvider.prototype.clone = function () {
        return new LoadableElementProvider(this.tagName);
    };
    return LoadableElementProvider;
}(common_1.Provider));
LoadableElementProvider.NS = "loadableElements";
exports.LoadableElementProvider = LoadableElementProvider;
exports.createSyntheticHTMLProviders = function () {
    return dom_1.HTML_TAG_NAMES.map(function (tagName) { return new SyntheticDOMElementClassProvider(dom_1.HTML_XMLNS, tagName, dom_1.SyntheticHTMLElement); }).concat(dom_1.SVG_TAG_NAMES.map(function (tagName) { return new SyntheticDOMElementClassProvider(dom_1.SVG_XMLNS, tagName, dom_1.SyntheticHTMLElement); }), [
        new sandbox_1.ContentEditorFactoryProvider(common_1.CSS_MIME_TYPE, sandbox_2.CSSEditor),
        new sandbox_1.ContentEditorFactoryProvider(common_1.HTML_MIME_TYPE, sandbox_2.MarkupEditor),
        new sandbox_1.SandboxModuleEvaluatorFactoryProvider(common_1.CSS_MIME_TYPE, sandbox_2.CSSDependencyEvaluator),
        new sandbox_1.SandboxModuleEvaluatorFactoryProvider(common_1.HTML_MIME_TYPE, sandbox_2.HTMLDependencyEvaluator),
        new sandbox_1.DependencyLoaderFactoryProvider(common_1.CSS_MIME_TYPE, sandbox_2.CSSDependencyLoader),
        new sandbox_1.DependencyLoaderFactoryProvider(common_1.HTML_MIME_TYPE, sandbox_2.HTMLDependencyLoader),
        new SyntheticDOMElementClassProvider(dom_1.HTML_XMLNS, "body", dom_1.SyntheticHTMLBodyElement),
        new SyntheticDOMElementClassProvider(dom_1.HTML_XMLNS, "canvas", dom_1.SyntheticHTMLCanvasElement),
        new SyntheticDOMElementClassProvider(dom_1.HTML_XMLNS, "link", dom_1.SyntheticHTMLLinkElement),
        new SyntheticDOMElementClassProvider(dom_1.HTML_XMLNS, "a", dom_1.SyntheticHTMLAnchorElement),
        new SyntheticDOMElementClassProvider(dom_1.HTML_XMLNS, "script", dom_1.SyntheticHTMLScriptElement),
        new SyntheticDOMElementClassProvider(dom_1.HTML_XMLNS, "style", dom_1.SyntheticHTMLStyleElement),
        new SyntheticDOMElementClassProvider(dom_1.HTML_XMLNS, "iframe", dom_1.SyntheticHTMLIframeElement),
        new ElementTextContentMimeTypeProvider("style", function () { return "text/css"; }),
        // TODO - move these to htmlCoreProviders
        // mime types
        new common_1.MimeTypeProvider("css", common_1.CSS_MIME_TYPE),
        new common_1.MimeTypeProvider("htm", common_1.HTML_MIME_TYPE),
        new common_1.MimeTypeProvider("html", common_1.HTML_MIME_TYPE),
    ]);
};
//# sourceMappingURL=providers.js.map