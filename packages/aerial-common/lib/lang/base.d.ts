import { IRange } from "../geom";
export interface ISourcePosition {
    line: number;
    column: number;
}
export declare function sourcePositionEquals(a: ISourcePosition, b: ISourcePosition): boolean;
export interface ISourceLocation {
    start?: ISourcePosition;
    end?: ISourcePosition;
}
export interface IASTNode {
    parent: IASTNode;
    readonly kind: number;
    accept(visitor: any): any;
}
export declare function cloneSourcePosition({line, column}: ISourcePosition): ISourcePosition;
export declare function cloneSourceLocation({start, end}: ISourceLocation): ISourceLocation;
export interface IExpression extends IASTNode {
    location: ISourceLocation;
}
export declare abstract class BaseExpression implements IExpression {
    readonly abstract kind: number;
    parent: IASTNode;
    location: ISourceLocation;
    constructor(location: ISourceLocation);
    inRange(selection: IRange): void;
    abstract accept(visitor: any): any;
}
