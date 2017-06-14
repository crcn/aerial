import postcss = require("postcss");
import { ISyntheticObject, ISyntheticSourceInfo, BaseContentEditor } from "aerial-sandbox";
export declare class CSSEditor extends BaseContentEditor<postcss.Node> {
    private _kernel;
    protected findTargetASTNode(root: postcss.Container, target: ISyntheticObject): postcss.ChildNode;
    protected nodeMatchesSyntheticSource(node: postcss.Node, source: ISyntheticSourceInfo): boolean;
    parseContent(content: string): postcss.Root;
    getFormattedContent(root: postcss.Rule): string;
}
