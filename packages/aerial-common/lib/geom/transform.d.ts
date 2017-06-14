import { IPoint } from "./base";
export declare class Transform {
    left: number;
    top: number;
    scale: number;
    constructor(left?: number, top?: number, scale?: number);
    localizePosition(position: IPoint): {
        left: number;
        top: number;
    };
}
