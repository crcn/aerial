import path =  require("path");
import sm = require("source-map");
import parse5 = require("parse5");

import {
  Dependency,
  IDependencyLoader,
  IDependencyContent,
  BaseDependencyLoader,
  DefaultDependencyLoader,
  IDependencyLoaderResult,
  DependencyLoaderFactoryProvider,
} from "aerial-sandbox";

import {
  inject,
  Kernel,
  injectProvider,
  HTML_MIME_TYPE,
  ISourceLocation,
  ISourcePosition,
  KernelProvider,
} from "aerial-common";

import {
  LoadableElementProvider,
  ElementTextContentMimeTypeProvider,
} from "../providers";

import {
  getHTMLASTNodeLocation,
  HTML_VOID_ELEMENTS,
} from "../dom";

const hasProtocol = (value) => !!/\w+:\/\//.test(value);

// TODO - need to add source maps here. Okay for now since line & column numbers stay
// the same even when src & href attributes are manipulated. However, the editor *will* break
// if there's a manipulated href / src attribute that shares the same line with another one.
export class HTMLDependencyLoader extends BaseDependencyLoader {

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  async load(dependency: Dependency, { type, content }): Promise<IDependencyLoaderResult> {

    const self = this;

    const { uri, hash } = dependency;

    // fetch all custom tag names that need to be loaded when scanning the dependency graph.
    const loadableTagNames = this._kernel.queryAll<LoadableElementProvider>(LoadableElementProvider.getId("**")).map(provider => provider.tagName);

    const expression = parse5.parse(String(content), { locationInfo: true }) as parse5.AST.Default.Document;
    const imports: string[] = [];
    const dirname = path.dirname(uri);

    const getAttr = (element: parse5.AST.Default.Element, name: string) => {
      return element.attrs.find((attr) => attr.name === name);
    }

    const mapAttribute = async (parent: parse5.AST.Default.Element, { name, value }: parse5.AST.Default.Attribute) => {

      let shouldGraph  = false;
      let shouldImport = false;
      
      // must be white listed here to present certain elements such as remote browser & anchor tags from loading resources. 
      if ((/^(link|script|img|source)$/.test(parent.nodeName) || loadableTagNames.indexOf(parent.nodeName) !== -1) && value && value.substr(0, 5) !== "data:") {

        // do not add these to the dependency graph
        shouldImport = !/^(img|source)$/.test(parent.nodeName);

        if (parent.nodeName === "link") {
          const rel = getAttr(parent, "rel");
          shouldGraph = rel && /(stylesheet|import)/.test(rel.value);
        } else {
          shouldGraph = true;
        }
      } else {
        shouldGraph = false;
      }

      if (shouldGraph) {     
        if (value.substr(0, 2) === "//") {
          value = "http:" + value;
        }

        if (/^(src|href)$/.test(name)) {
          value = (await self.strategy.resolve(value, uri)).uri;
          if (shouldImport) {
            imports.push(value);
          }
        }
      }
      
      return [" ", name, `="`, value,`"`].join("");
    }

    const map = async (expression: parse5.AST.Default.Node): Promise<sm.SourceNode> => {
      const location = getHTMLASTNodeLocation(expression) || { line: 1, column: 1 };
      if (expression.nodeName === "#documentType") {
        return new sm.SourceNode(location.line, location.column, uri, `<!DOCTYPE ${(expression as parse5.AST.Default.DocumentType).name}>`);
      } else if (expression.nodeName === "#comment") {
        return new sm.SourceNode(location.line, location.column, uri, [`<!--${(expression as parse5.AST.Default.CommentNode).data}-->`]);
      } else if (expression.nodeName === "#text") {
        return new sm.SourceNode(location.line, location.column, uri, [(expression as parse5.AST.Default.TextNode).value]);
      } else if (expression.nodeName === "#document" || expression.nodeName === "#document-fragment") {
        return new sm.SourceNode(location.line, location.column, uri, (await Promise.all((expression as parse5.AST.Default.Element).childNodes.map(map))));
      }

      const elementExpression = expression as parse5.AST.Default.Element;

      const { nodeName, attrs, childNodes } = elementExpression;

      const buffer: (string | sm.SourceNode)[] | string | sm.SourceNode = [
        `<` + nodeName,
        ...(await Promise.all(attrs.map(attrib => mapAttribute(elementExpression, attrib)))),
        `>`
      ];

      const textMimeType = ElementTextContentMimeTypeProvider.lookup(expression, self._kernel);
      const textLoaderProvider = textMimeType && DependencyLoaderFactoryProvider.find(textMimeType, self._kernel);

      if (textLoaderProvider && elementExpression.childNodes.length) {
        const textLoader = textLoaderProvider.create(self.strategy);

        const firstChild = elementExpression.childNodes[0] as parse5.AST.Default.TextNode;
        const firstChildLocation = getHTMLASTNodeLocation(firstChild);
        const lines = Array.from({ length: firstChildLocation.line - 1 }).map(() => "\n").join("");

        const textResult = await textLoader.load(dependency, { 
          type: textMimeType, 
          content: lines + firstChild.value
        });

        let textContent = textResult.content;

        if (textResult.map) {
          const sourceMappingURL = `data:application/json;base64,${new Buffer(JSON.stringify(textResult.map)).toString("base64")}`;
          textContent += `/*# sourceMappingURL=${sourceMappingURL} */`;
        }

        buffer.push(new sm.SourceNode(firstChildLocation.line, firstChildLocation.column, uri, textContent));

      } else {
        buffer.push(...(await Promise.all(childNodes.map(child => map(child)))));
      }

      if (HTML_VOID_ELEMENTS.indexOf(nodeName.toLowerCase()) === -1) {
        buffer.push(`</${nodeName}>`);
      }
      
      return new sm.SourceNode(location.line, location.column, uri, buffer);
    }

    const sourceNode = await map(expression);
    
    const result = sourceNode.toStringWithSourceMap({
      file: uri
    });
    
    return {
      content: result.code,
      map: result.map.toJSON(),
      type: HTML_MIME_TYPE,
      importedDependencyUris: imports
    };
  }
}