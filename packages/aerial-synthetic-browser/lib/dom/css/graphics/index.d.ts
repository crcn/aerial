import { SyntheticCSSStyle } from "../style";
import { Observable, ObservableCollection } from "aerial-common";
import { SyntheticCSSColor, SyntheticCSSFilter, SyntheticCSSMeasurment } from "./declaration";
export * from "./declaration";
export declare class SyntheticCSSStylePosition {
    left: SyntheticCSSMeasurment;
    top: SyntheticCSSMeasurment;
    constructor(left: SyntheticCSSMeasurment, top: SyntheticCSSMeasurment);
    toString(): string;
}
export declare function isCSSBlendMode(blendMode: string): boolean;
export declare function isCSSClipType(clip: string): boolean;
export declare type CSSBlendModeType = "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "saturation" | "color" | "luminosity";
export declare type CSSBackgroundClipType = "border-box" | "padding-box" | "content-box" | "text";
export declare class SyntheticCSSStyleBackground extends Observable {
    color: SyntheticCSSColor;
    image: string;
    position: SyntheticCSSStylePosition;
    repeat: string;
    size: string | Array<SyntheticCSSMeasurment>;
    blendMode: CSSBlendModeType;
    clip: CSSBackgroundClipType;
    constructor(properties?: any);
    setPosition(value: string[]): void;
    setProperties(properties: any[]): void;
    setProperty(name: string, value: any): void;
    toString(): string;
}
export declare class SyntheticCSSBox extends Observable {
    leftWidth: SyntheticCSSMeasurment;
    topWidth: SyntheticCSSMeasurment;
    rightWidth: SyntheticCSSMeasurment;
    bottomWidth: SyntheticCSSMeasurment;
    setProperty(name: string, value: any): void;
    width: any;
    getStyleProperties(): string;
}
export declare class SyntheticCSSBorder extends SyntheticCSSBox {
    leftColor: SyntheticCSSColor;
    leftStyle: string;
    topColor: SyntheticCSSColor;
    topStyle: string;
    rightColor: SyntheticCSSColor;
    rightStyle: string;
    bottomColor: SyntheticCSSColor;
    bottomStyle: string;
    left: any;
    top: any;
    right: any;
    bottom: any;
    width: SyntheticCSSMeasurment;
    color: SyntheticCSSColor;
    style: string;
    private _getSideStyle(side);
    private _setSideStyle(side, value);
    setProperties(value: any): void;
    private _sortParams(params);
}
export declare class SyntheticCSSStyleBoxShadow extends Observable {
    inset: boolean;
    x: SyntheticCSSMeasurment;
    y: SyntheticCSSMeasurment;
    blur: SyntheticCSSMeasurment;
    spread: SyntheticCSSMeasurment;
    color: SyntheticCSSColor;
    constructor(properties?: any);
    setProperties(properties: any[]): void;
    setProperty(name: string, value: any): void;
    toString(): string;
}
export declare function isUnitBasedCSSProperty(property: string): boolean;
export declare class SyntheticCSSStyleGraphics extends Observable {
    readonly style: SyntheticCSSStyle;
    backgrounds: ObservableCollection<SyntheticCSSStyleBackground>;
    boxShadows: ObservableCollection<SyntheticCSSStyleBoxShadow>;
    filters: ObservableCollection<SyntheticCSSFilter>;
    margin: SyntheticCSSBox;
    border: SyntheticCSSBorder;
    padding: SyntheticCSSBox;
    opacity: number;
    mixBlendMode: string;
    fontFamily: string[];
    color: SyntheticCSSColor;
    fontSize: SyntheticCSSMeasurment;
    fontWeight: string;
    letterSpacing: SyntheticCSSMeasurment;
    lineHeight: SyntheticCSSMeasurment;
    textAlign: string;
    wordWrap: string;
    textDecoration: string;
    textTransform: string;
    fontStyle: string;
    whiteSpace: string;
    textOverflow: string;
    width: SyntheticCSSMeasurment;
    height: SyntheticCSSMeasurment;
    left: SyntheticCSSMeasurment;
    top: SyntheticCSSMeasurment;
    right: SyntheticCSSMeasurment;
    bottom: SyntheticCSSMeasurment;
    overflow: string;
    minWidth: SyntheticCSSMeasurment;
    minHeight: SyntheticCSSMeasurment;
    maxWidth: SyntheticCSSMeasurment;
    maxHeight: SyntheticCSSMeasurment;
    position: string;
    display: string;
    flex: string;
    alignItems: string;
    justifyContent: string;
    flexFlow: string;
    flexWrap: string;
    flexDirection: string;
    float: string;
    constructor(style: SyntheticCSSStyle);
    setProperties(style: SyntheticCSSStyle): void;
    dispose(): void;
    setProperty(name: string, value: any): void;
    readonly primaryBackground: SyntheticCSSStyleBackground;
    addBackground(params?: any[]): SyntheticCSSStyleBackground;
    removeBackground(background: SyntheticCSSStyleBackground): SyntheticCSSStyleBackground;
    addBoxShadow(params?: any[]): SyntheticCSSStyleBoxShadow;
    addFilter(name: string, params?: any[]): any;
    renameFilter(filter: SyntheticCSSFilter, newName: string): SyntheticCSSFilter;
    removeFilter(filter: SyntheticCSSFilter): SyntheticCSSFilter;
    removeBoxShadow(boxShadow: SyntheticCSSStyleBoxShadow): SyntheticCSSStyleBoxShadow;
    toStyle(): SyntheticCSSStyle;
}
