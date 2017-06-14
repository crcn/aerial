import { SyntheticDOMNode } from "../markup";
export interface ISelectorTester {
    source: string;
    test(node: SyntheticDOMNode): any;
}
export declare function getSelectorTester(selectorSource: string, start: SyntheticDOMNode): ISelectorTester;
