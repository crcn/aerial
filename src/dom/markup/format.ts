

import parse5 = require("parse5");
import { repeat } from "lodash";


export function formatMarkupExpression(node: parse5.AST.Default.Node, defaultIndentation: string = "  "): string {

  const indentation = defaultIndentation;

  function format(current: parse5.AST.Default.Node, level: number = 0) {

    function indent() {
      return repeat(indentation, level);
    }

    const mapAttribute = ({ name, value }: any) => {
      return ` ${name}="${value}"`;
    }
    
    if (current.nodeName === "#documentType") {
      const doctype = current as parse5.AST.Default.DocumentType;
      return `<!DOCTYPE ${doctype.name}>`;
    } else if (current.nodeName === "#text") {
      const text = current as parse5.AST.Default.TextNode;

      // only ws?
      if (/^[\s\r\n\t]$/.test(text.value)) return "";
      return indent() + text.value.trim();
    } else if (current.nodeName === "#comment") {
      const comment = current as parse5.AST.Default.CommentNode;
      return indent() + `<!--${comment.data}-->`;
    } else if (current.nodeName === "#document" || current.nodeName === "#document-fragment") {
      const fragment = current as parse5.AST.Default.DocumentFragment;
      return fragment.childNodes.map((child) => format(child, level)).join("\n");
    }

    const element = current as parse5.AST.Default.Element;

    let buffer = indent() + `<${element.nodeName}${element.attrs.map(mapAttribute).join("")}>`;

    if (element.childNodes.length) {
      buffer += "\n" + element.childNodes.map((child) => format(child, level + 1)).join("\n") + "\n" + indent();
    }

    buffer += `</${element.nodeName}>`;
    return buffer;
  }

  return format(node, 0);
}