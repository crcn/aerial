import { IMarkupNodeVisitor } from "./visitor";
import { ITreeWalker } from "aerial-common";
import { SyntheticDOMValueNode } from "./value-node";
export declare class SyntheticDOMComment extends SyntheticDOMValueNode {
    readonly nodeType: number;
    constructor(nodeValue: string);
    toString(): string;
    textContent: string;
    accept(visitor: IMarkupNodeVisitor): any;
    protected cloneShallow(): SyntheticDOMComment;
    visitWalker(walker: ITreeWalker): void;
}
