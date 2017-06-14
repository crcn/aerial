import { BoundingRect } from "./bounding-rect";
export interface IRange {
    start: number;
    end: number;
}
export declare function cloneRange(range: IRange): {
    start: number;
    end: number;
};
export interface IPoint {
    left: number;
    top: number;
}
export declare class Point implements IPoint {
    left: number;
    top: number;
    constructor(left: number, top: number);
    clone(): Point;
    distanceTo(point: Point): number;
}
export declare class Line {
    from: Point;
    to: Point;
    constructor(from: Point, to: Point);
    readonly points: Point[];
    flip(): Line;
    reverse(): Line;
    readonly length: number;
    getBoundingRect(): BoundingRect;
}
