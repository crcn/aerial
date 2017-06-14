import { SyntheticCSSElementStyleRule } from "./style-rule";
import { SerializedContentType, ITreeWalker } from "aerial-common";
import { SyntheticCSSGroupAtRule } from "./atrule";
export interface ISerializedSyntheticCSSMediaRule {
    media: string[];
    cssRules: Array<SerializedContentType<any>>;
}
export declare class SyntheticCSSMediaRule extends SyntheticCSSGroupAtRule {
    media: string[];
    readonly atRuleName: string;
    constructor(media: string[], rules: SyntheticCSSElementStyleRule[]);
    readonly cssText: string;
    readonly params: string;
    protected cloneShallow(): SyntheticCSSMediaRule;
    createEdit(): any;
    visitWalker(walker: ITreeWalker): void;
}
