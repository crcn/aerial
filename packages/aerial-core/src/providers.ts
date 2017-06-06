import { SyntheticBrowser } from "./browser";
import { RemoteBrowserService } from "./remote-browser";
import { syntheticElementClassType, SyntheticDOMNode } from "./dom";
import parse5 = require("parse5");

import { 
  ContentEditorFactoryProvider, 
  DependencyLoaderFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "@tandem/sandbox";

import { 
  Kernel, 
  Provider, 
  CSS_MIME_TYPE,
  HTML_MIME_TYPE,
  MimeTypeProvider, 
  ApplicationServiceProvider,
} from "@tandem/common";

import { 
  HTML_XMLNS, 
  SVG_XMLNS,
  SVG_TAG_NAMES,
  HTML_TAG_NAMES,
  SyntheticHTMLElement,
  SyntheticHTMLBodyElement,
  SyntheticHTMLIframeElement, 
  SyntheticHTMLAnchorElement, 
  SyntheticHTMLLinkElement, 
  SyntheticHTMLStyleElement, 
  SyntheticHTMLScriptElement, 
  SyntheticHTMLCanvasElement, 
} from "./dom";

import {
  CSSEditor,
  MarkupEditor,
  CSSDependencyEvaluator,
  HTMLDependencyEvaluator,
  CSSDependencyLoader,
  HTMLDependencyLoader,
 } from "./sandbox";

export class SyntheticDOMElementClassProvider extends Provider<syntheticElementClassType> {
  static readonly SYNTHETIC_ELEMENT_CLASS_NS = "syntheticMarkupElementClass";

  constructor(readonly xmlns: string, readonly tagName: string, value: syntheticElementClassType) {
    super(SyntheticDOMElementClassProvider.getNamespace(xmlns, tagName), value);
  }

  clone() {
    return new SyntheticDOMElementClassProvider(this.xmlns, this.tagName, this.value);
  }

  static getNamespace(xmlns: string, tagName: string) {
    return [this.SYNTHETIC_ELEMENT_CLASS_NS, encodeURIComponent(xmlns), tagName].join("/");
  }

  static findAll(kernel: Kernel) {
    return kernel.queryAll<SyntheticDOMElementClassProvider>([this.SYNTHETIC_ELEMENT_CLASS_NS, "**"].join("/"));
  }
}

export class MarkupMimeTypeXMLNSProvider extends Provider<string> {
  static readonly MARKUP_MIME_TYPE_XMLNS = "markupMimeTypeXMLNS";
  constructor(readonly mimeType: string, readonly xmlns: string) {
    super(MarkupMimeTypeXMLNSProvider.getNamespace(mimeType), xmlns);
  }
  static getNamespace(mimeType: string) {
    return [this.MARKUP_MIME_TYPE_XMLNS, mimeType].join("/");
  }
  static lookup(path: string, kernel: Kernel): string {
    const mimeType = MimeTypeProvider.lookup(path, kernel);
    const provider = kernel.query<MarkupMimeTypeXMLNSProvider>(this.getNamespace(mimeType));
    return provider && provider.value;
  }
}

export type ElementTextContentMimeTypeGetter = (element: parse5.AST.Default.Node) => string;

export class ElementTextContentMimeTypeProvider extends Provider<ElementTextContentMimeTypeGetter> {
  static readonly NS = "elementTextContentMimeTypes";
  constructor(readonly tagName: string, readonly getter: ElementTextContentMimeTypeGetter) {
    super(ElementTextContentMimeTypeProvider.getId(tagName.toLowerCase()), getter);
  }
  clone() {
    return new ElementTextContentMimeTypeProvider(this.tagName, this.getter);
  }
  static getId(tagName: string) {
    return [this.NS, tagName].join("/");
  }
  static lookup(element: parse5.AST.Default.Node, kernel: Kernel) {
    const provider = kernel.query<ElementTextContentMimeTypeProvider>(this.getId(element.nodeName.toLowerCase()));
    return provider && provider.getter(element);
  }
}

export class LoadableElementProvider extends Provider<boolean> {
  static readonly NS = "loadableElements";
  constructor(readonly tagName: string) {
    super(LoadableElementProvider.getId(tagName), true);
  }
  static getId(tagName: string) {
    return [this.NS, tagName].join("/");
  }
  clone() {
    return new LoadableElementProvider(this.tagName);
  }
}

export const createSyntheticHTMLProviders = () => {
  return [
    ...HTML_TAG_NAMES.map((tagName) => new SyntheticDOMElementClassProvider(HTML_XMLNS, tagName, SyntheticHTMLElement)),
    ...SVG_TAG_NAMES.map((tagName) => new SyntheticDOMElementClassProvider(SVG_XMLNS, tagName, SyntheticHTMLElement)),

    new ContentEditorFactoryProvider(CSS_MIME_TYPE, CSSEditor),
    new ContentEditorFactoryProvider(HTML_MIME_TYPE, MarkupEditor),
    new SandboxModuleEvaluatorFactoryProvider(CSS_MIME_TYPE, CSSDependencyEvaluator),
    new SandboxModuleEvaluatorFactoryProvider(HTML_MIME_TYPE, HTMLDependencyEvaluator),
    new DependencyLoaderFactoryProvider(CSS_MIME_TYPE, CSSDependencyLoader),
    new DependencyLoaderFactoryProvider(HTML_MIME_TYPE, HTMLDependencyLoader),

    new SyntheticDOMElementClassProvider(HTML_XMLNS, "body", SyntheticHTMLBodyElement),
    new SyntheticDOMElementClassProvider(HTML_XMLNS, "canvas", SyntheticHTMLCanvasElement),
    new SyntheticDOMElementClassProvider(HTML_XMLNS, "link", SyntheticHTMLLinkElement),
    new SyntheticDOMElementClassProvider(HTML_XMLNS, "a", SyntheticHTMLAnchorElement),
    new SyntheticDOMElementClassProvider(HTML_XMLNS, "script", SyntheticHTMLScriptElement),
    new SyntheticDOMElementClassProvider(HTML_XMLNS, "style", SyntheticHTMLStyleElement),
    new SyntheticDOMElementClassProvider(HTML_XMLNS, "iframe", SyntheticHTMLIframeElement),
    new ElementTextContentMimeTypeProvider("style", () => "text/css"),

    // TODO - move these to htmlCoreProviders
    // mime types
    new MimeTypeProvider("css", CSS_MIME_TYPE),
    new MimeTypeProvider("htm", HTML_MIME_TYPE),
    new MimeTypeProvider("html", HTML_MIME_TYPE),
  ];
}