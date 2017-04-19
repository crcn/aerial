import parse5 = require("parse5");

export const getHTMLASTNodeLocation = (expression: parse5.AST.Default.CommentNode|parse5.AST.Default.Element|parse5.AST.Default.TextNode|any) => {
  const loc = expression.__location as any;
  if (!loc) return undefined;
  if ((loc as parse5.MarkupData.ElementLocation).startTag) {
    return { line: loc.startTag.line, column: loc.startTag.col }
  } else {
    return { line: loc.line, column: loc.col };
  }
}


export function traverseDOMNodeExpression(target: parse5.AST.Default.Node, each: (expression: parse5.AST.Default.Node) => boolean | void) {
  if (target.nodeName === "#document" || target.nodeName === "#document-fragment") {
    
  }
  for (const child of target["childNodes"] || []) {
    if (each(child) === false) return;
    traverseDOMNodeExpression(child, each);
  }
}

export function findDOMNodeExpression(target: parse5.AST.Default.Node, filter: (expression: parse5.AST.Default.Node) => boolean): parse5.AST.Default.Node {
  let found;
  traverseDOMNodeExpression(target, (expression) => {
    if (filter(expression)) {
      found = expression;
      return false;
    }
  });
  return found;
}

export function filterDOMNodeExpressions(target: parse5.AST.Default.Node, filter: (expression: parse5.AST.Default.Node) => boolean): parse5.AST.Default.Node[] {
  let found = [];
  traverseDOMNodeExpression(target, (expression) => {
    if (filter(expression)) {
      found.push(expression);
    }
  });
  return found;
}

