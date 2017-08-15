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
var aerial_sandbox_1 = require("aerial-sandbox");
var aerial_common_1 = require("aerial-common");
var dom_1 = require("./dom");
var sandbox_1 = require("./sandbox");
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
    SyntheticDOMElementClassProvider.SYNTHETIC_ELEMENT_CLASS_NS = "syntheticMarkupElementClass";
    return SyntheticDOMElementClassProvider;
}(aerial_common_1.Provider));
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
        var mimeType = aerial_common_1.MimeTypeProvider.lookup(path, kernel);
        var provider = kernel.query(this.getNamespace(mimeType));
        return provider && provider.value;
    };
    MarkupMimeTypeXMLNSProvider.MARKUP_MIME_TYPE_XMLNS = "markupMimeTypeXMLNS";
    return MarkupMimeTypeXMLNSProvider;
}(aerial_common_1.Provider));
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
    ElementTextContentMimeTypeProvider.NS = "elementTextContentMimeTypes";
    return ElementTextContentMimeTypeProvider;
}(aerial_common_1.Provider));
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
    LoadableElementProvider.NS = "loadableElements";
    return LoadableElementProvider;
}(aerial_common_1.Provider));
exports.LoadableElementProvider = LoadableElementProvider;
exports.createSyntheticHTMLProviders = function () {
    return dom_1.HTML_TAG_NAMES.map(function (tagName) { return new SyntheticDOMElementClassProvider(dom_1.HTML_XMLNS, tagName, dom_1.SyntheticHTMLElement); }).concat(dom_1.SVG_TAG_NAMES.map(function (tagName) { return new SyntheticDOMElementClassProvider(dom_1.SVG_XMLNS, tagName, dom_1.SyntheticHTMLElement); }), [
        new aerial_sandbox_1.ContentEditorFactoryProvider(aerial_common_1.CSS_MIME_TYPE, sandbox_1.CSSEditor),
        new aerial_sandbox_1.ContentEditorFactoryProvider(aerial_common_1.HTML_MIME_TYPE, sandbox_1.MarkupEditor),
        new aerial_sandbox_1.SandboxModuleEvaluatorFactoryProvider(aerial_common_1.CSS_MIME_TYPE, sandbox_1.CSSDependencyEvaluator),
        new aerial_sandbox_1.SandboxModuleEvaluatorFactoryProvider(aerial_common_1.HTML_MIME_TYPE, sandbox_1.HTMLDependencyEvaluator),
        new aerial_sandbox_1.DependencyLoaderFactoryProvider(aerial_common_1.CSS_MIME_TYPE, sandbox_1.CSSDependencyLoader),
        new aerial_sandbox_1.DependencyLoaderFactoryProvider(aerial_common_1.HTML_MIME_TYPE, sandbox_1.HTMLDependencyLoader),
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
        new aerial_common_1.MimeTypeProvider("css", aerial_common_1.CSS_MIME_TYPE),
        new aerial_common_1.MimeTypeProvider("htm", aerial_common_1.HTML_MIME_TYPE),
        new aerial_common_1.MimeTypeProvider("html", aerial_common_1.HTML_MIME_TYPE),
    ]);
};
//# sourceMappingURL=providers.js.map