import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyle } from "./style";
import { ISyntheticCSSAtRule } from "./atrule";
import { SerializedContentType } from "aerial-common";
export interface ISerializedSyntheticCSSFontFace {
    style: SerializedContentType<any>;
}
export declare class SyntheticCSSFontFace extends SyntheticCSSStyleRule implements ISyntheticCSSAtRule {
    readonly atRuleName: string;
    constructor(style: SyntheticCSSStyle);
    readonly params: string;
    readonly cssText: string;
    cloneShallow(): SyntheticCSSFontFace;
    countShallowDiffs(target: SyntheticCSSFontFace): 0 | -1;
}
