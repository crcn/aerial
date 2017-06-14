import { BoundingRect } from "../../geom";
export declare function translateAbsoluteToRelativePoint(event: any, relativeElement: any): {
    left: number;
    top: number;
};
export declare function calculateCSSMeasurments(style: any): any;
export declare function calculateUntransformedBoundingRect(node: HTMLElement): BoundingRect;
export declare function calculateAbsoluteBounds(node: HTMLElement): BoundingRect;
