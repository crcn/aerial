import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDOMContainer } from "./container";
export declare class SyntheticDocumentFragment extends SyntheticDOMContainer {
    readonly nodeType: number;
    constructor();
    accept(visitor: IMarkupNodeVisitor): any;
    protected cloneShallow(): SyntheticDocumentFragment;
}
