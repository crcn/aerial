import { syntheticElementClassType } from "./dom";
import parse5 = require("parse5");
import { ContentEditorFactoryProvider, DependencyLoaderFactoryProvider, SandboxModuleEvaluatorFactoryProvider } from "aerial-sandbox";
import { Kernel, Provider, MimeTypeProvider } from "aerial-common";
export declare class SyntheticDOMElementClassProvider extends Provider<syntheticElementClassType> {
    readonly xmlns: string;
    readonly tagName: string;
    static readonly SYNTHETIC_ELEMENT_CLASS_NS: string;
    constructor(xmlns: string, tagName: string, value: syntheticElementClassType);
    clone(): SyntheticDOMElementClassProvider;
    static getNamespace(xmlns: string, tagName: string): string;
    static findAll(kernel: Kernel): SyntheticDOMElementClassProvider[];
}
export declare class MarkupMimeTypeXMLNSProvider extends Provider<string> {
    readonly mimeType: string;
    readonly xmlns: string;
    static readonly MARKUP_MIME_TYPE_XMLNS: string;
    constructor(mimeType: string, xmlns: string);
    static getNamespace(mimeType: string): string;
    static lookup(path: string, kernel: Kernel): string;
}
export declare type ElementTextContentMimeTypeGetter = (element: parse5.AST.Default.Node) => string;
export declare class ElementTextContentMimeTypeProvider extends Provider<ElementTextContentMimeTypeGetter> {
    readonly tagName: string;
    readonly getter: ElementTextContentMimeTypeGetter;
    static readonly NS: string;
    constructor(tagName: string, getter: ElementTextContentMimeTypeGetter);
    clone(): ElementTextContentMimeTypeProvider;
    static getId(tagName: string): string;
    static lookup(element: parse5.AST.Default.Node, kernel: Kernel): string;
}
export declare class LoadableElementProvider extends Provider<boolean> {
    readonly tagName: string;
    static readonly NS: string;
    constructor(tagName: string);
    static getId(tagName: string): string;
    clone(): LoadableElementProvider;
}
export declare const createSyntheticHTMLProviders: () => (MimeTypeProvider | ContentEditorFactoryProvider | SandboxModuleEvaluatorFactoryProvider | DependencyLoaderFactoryProvider | ElementTextContentMimeTypeProvider | SyntheticDOMElementClassProvider)[];
