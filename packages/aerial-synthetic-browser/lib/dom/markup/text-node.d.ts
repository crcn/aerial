import { IMarkupNodeVisitor } from "./visitor";
import { ITreeWalker } from "aerial-common";
import { SyntheticDOMValueNode } from "./value-node";
export declare class SyntheticDOMText extends SyntheticDOMValueNode {
    readonly nodeType: number;
    constructor(nodeValue: string);
    textContent: string;
    toString(): string;
    accept(visitor: IMarkupNodeVisitor): any;
    protected cloneShallow(): SyntheticDOMText;
    visitWalker(walker: ITreeWalker): void;
}
