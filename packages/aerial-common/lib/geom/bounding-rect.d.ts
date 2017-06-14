import { IPoint } from "../geom";
export declare class BoundingRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    constructor(left: number, top: number, right: number, bottom: number);
    readonly position: IPoint;
    width: number;
    height: number;
    zoom(delta: number): BoundingRect;
    equalTo(rect: BoundingRect): boolean;
    readonly visible: boolean;
    toArray(): number[];
    intersects(...rects: BoundingRect[]): boolean;
    intersectsHorizontal(...rects: BoundingRect[]): boolean;
    intersectsVertical(...rects: BoundingRect[]): boolean;
    merge(...rects: Array<BoundingRect>): BoundingRect;
    move({left, top}: IPoint): BoundingRect;
    moveTo({left, top}: IPoint): BoundingRect;
    clone(): BoundingRect;
    static fromClientRect(rect: ClientRect): BoundingRect;
    static zeros(): BoundingRect;
    static merge(...rects: Array<BoundingRect>): BoundingRect;
}
