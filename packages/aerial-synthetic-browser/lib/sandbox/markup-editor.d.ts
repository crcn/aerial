import { Mutation } from "aerial-common";
import { ISyntheticObject, BaseContentEditor } from "aerial-sandbox";
import parse5 = require("parse5");
import { SyntheticDOMNode } from "../dom";
export declare class MarkupEditor extends BaseContentEditor<parse5.AST.Default.Node> {
    private _replacements;
    constructor(uri: any, content: any);
    findTargetASTNode(root: parse5.AST.Default.Node, synthetic: SyntheticDOMNode): parse5.AST.Default.Node;
    protected handleUnknownMutation(mutation: Mutation<ISyntheticObject>): void;
    parseContent(content: string): any;
    getFormattedContent(root: parse5.AST.Default.Node): string;
}
