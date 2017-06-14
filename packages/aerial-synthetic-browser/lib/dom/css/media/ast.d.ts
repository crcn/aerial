import { ISourceLocation } from "aerial-common";
export declare enum CSSMediaExpressionKind {
    MEDIA_QUERY_LIST = 1,
    MEDIA_QUERY = 2,
    FEATURE = 3,
}
export declare type MediaType = "all" | "aural" | "braille" | "handheld" | "print" | "projection" | "screen" | "tty" | "tv" | "embossed" | "speech";
export declare type MediaFeatureType = "width" | "min-width" | "max-width" | "height" | "min-height" | "max-height" | "aspect-ratio" | "min-aspect-ratio" | "max-aspect-ratio" | "color" | "min-color" | "max-color" | "color-indent" | "min-color-index" | "max-color-index" | "monochrome" | "min-monochrome" | "max-monochrome" | "resolution" | "min-resolution" | "max-resolution" | "scan" | "grid";
export interface ICSSMediaExpressionVisitor {
    visitMediaQueryList(expression: CSSMediaQueryListExpression): any;
    visitMediaQuery(expression: CSSMediaQueryExpression): any;
    visitMediaFeature(expression: CSSMediaFeatureExpression): any;
}
export declare abstract class CSSMediaExpression {
    readonly kind: CSSMediaExpressionKind;
    readonly location: ISourceLocation;
    constructor(kind: CSSMediaExpressionKind, location: ISourceLocation);
    abstract accept(visitor: ICSSMediaExpressionVisitor): any;
}
export declare class CSSMediaQueryListExpression extends CSSMediaExpression {
    readonly items: CSSMediaQueryExpression[];
    constructor(items: CSSMediaQueryExpression[], location: ISourceLocation);
    accept(visitor: ICSSMediaExpressionVisitor): void;
}
export declare class CSSMediaQueryExpression extends CSSMediaExpression {
    readonly operator: "only" | "not";
    readonly type: MediaType;
    readonly features: CSSMediaFeatureExpression[];
    constructor(operator: "only" | "not", type: MediaType, features: CSSMediaFeatureExpression[], location: ISourceLocation);
    accept(visitor: ICSSMediaExpressionVisitor): void;
}
export declare class CSSMediaFeatureExpression extends CSSMediaExpression {
    readonly name: MediaFeatureType;
    readonly value: string;
    constructor(name: MediaFeatureType, value: string, location: ISourceLocation);
    accept(visitor: ICSSMediaExpressionVisitor): void;
}
