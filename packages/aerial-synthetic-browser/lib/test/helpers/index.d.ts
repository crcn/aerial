import { SyntheticBrowser, SyntheticDocument, SyntheticCSSStyleSheet } from "../..";
export declare function createMockBrowser(): SyntheticBrowser;
export declare function generateRandomSyntheticHTMLElementSource(maxChildCount?: number, maxDepth?: number, maxAttributes?: number): any;
export declare function generateRandomSyntheticHTMLElement(document: SyntheticDocument, maxChildCount?: number, maxDepth?: number, maxAttributes?: number, generateShadow?: boolean): any;
export declare function generateRandomStyleSheet(maxRules?: number, maxDeclarations?: number): SyntheticCSSStyleSheet;
export declare const timeout: (ms?: number) => Promise<{}>;
