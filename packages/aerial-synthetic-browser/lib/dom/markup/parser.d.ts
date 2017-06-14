import parse5 = require("parse5");
export declare const getHTMLASTNodeLocation: (expression: any) => {
    line: any;
    column: any;
};
export declare function traverseDOMNodeExpression(target: parse5.AST.Default.Node, each: (expression: parse5.AST.Default.Node) => boolean | void): void;
export declare function findDOMNodeExpression(target: parse5.AST.Default.Node, filter: (expression: parse5.AST.Default.Node) => boolean): parse5.AST.Default.Node;
export declare function filterDOMNodeExpressions(target: parse5.AST.Default.Node, filter: (expression: parse5.AST.Default.Node) => boolean): parse5.AST.Default.Node[];
