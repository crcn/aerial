import {
  Dependency,
  IDependencyLoader,
  BaseDependencyLoader,
  IDependencyLoaderResult,
} from "@tandem/sandbox";

import * as path from "path";
import sm = require("source-map");
import postcss = require("postcss");
import { URIProtocolProvider } from "@tandem/sandbox"; 
import { CSS_MIME_TYPE, inject, Kernel, KernelProvider } from "aerial-common";

import {
  parseCSS,
} from "..";

const hasProtocol = (value) => /^\w+:\/\//.test(value);

export class CSSDependencyLoader extends BaseDependencyLoader {

  @inject(KernelProvider.ID)
  private _kernel: Kernel;
  
  
  async load(dependency: Dependency, { type, content, map }): Promise<IDependencyLoaderResult> {
    /*const content = this.content.replace(/url\(['"]?(.*?)['"]?\)/g, (match, uri) => {
      return `url("http://${window.location.host}/asset/` + encodeURIComponent(path.join(path.dirname(this.uri), uri.split(/\?|#/).shift())) + '")';
    });*/

    const { uri } = dependency;
    const sourceMappingUrl = (String(content).match(/sourceMappingURL=([^\s\*]+)/) || [])[1];

    if (!map && sourceMappingUrl) {
      const resolveSourceMappingUrl = (await this.strategy.resolve(sourceMappingUrl, uri)).uri;
      const protocol = URIProtocolProvider.lookup(resolveSourceMappingUrl, this._kernel);
      const result = await protocol.read(resolveSourceMappingUrl);
      map = JSON.parse(String(result.content));
    }

    const consumer = map && new sm.SourceMapConsumer(map);
    const sourceRoot = map && map.sourceRoot || uri;
    const fileDirectory = path.dirname(uri);
    const importedUris: string[] = [];
    
    const compile = async (node: postcss.Node): Promise<sm.SourceNode> => {
      let line = node.source.start.line;

      // inconsistencies between source maps lib and postcss -- this offset should fix that.
      let column = node.source.start.column - 1;
      let origUri = uri;

      if (consumer) {
        const orig = consumer.originalPositionFor({ line, column });
        line = orig.line;
        column = orig.column;
        origUri = orig.source && (await this.strategy.resolve(orig.source, sourceRoot)).uri || uri;
      }

      let buffer: (string | sm.SourceNode)[] | string | sm.SourceNode;

      if (node.type === "root") {
        buffer = await Promise.all((<postcss.Root>node).nodes.map(compile));
      } else if (node.type === "rule") {
        const rule = <postcss.Rule>node;
        buffer = [rule.selector, ` {`, ...(await Promise.all(rule.nodes.map(compile))), `}\n`];
      } else if (node.type === "atrule") {
        const rule = <postcss.AtRule>node;
        buffer = [`@${rule.name} ${rule.params}`];
        if (rule.nodes) {
          buffer.push(`{`, ...(await Promise.all(rule.nodes.map(compile))), `}\n`);
        } else {
          buffer.push(";");
        }
      } else if (node.type === "decl") {

        let { prop, value, important } = <postcss.Declaration>node;

        if (/url\(.*?\)/.test(value)) {

          for (const match of value.match(/url\((.*?)\)/g)) {
            
            const [whole, url] = match.match(/url\((.*?)\)/);

            let repl;
            if (url.substr(0, 5) === "data:") continue;

            // this can still break, but it's a quick implementation that should work 99% of the time.
            // Good for now.
            repl = url.replace(/["']/g, "");
            repl = (await this.strategy.resolve(repl, uri)).uri;

            importedUris.push(repl);

            value = value.replace(url, `"${repl}"`);
          }
        }
        
        if (important) {
          value += " !important";
        }

        buffer = [prop, ':', value, ';'];
      }

      return new sm.SourceNode(line, column, origUri,  buffer);
    }

    let result;
    result = (await compile(parseCSS(content, map))).toStringWithSourceMap({
      file: uri
    });

    return {
      type: CSS_MIME_TYPE,
      map: result.map.toJSON(),
      content: result.code,
      importedDependencyUris: importedUris
    };
  }
}