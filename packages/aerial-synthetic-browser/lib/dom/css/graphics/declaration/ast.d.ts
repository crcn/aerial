import { ISourceLocation } from "aerial-common";
export declare enum CSSDeclValueExpressionKind {
    IDENTIFIER = 1,
    COMMA_LIST = 2,
    SPACE_LIST = 3,
    MEASUREMENT = 4,
    DEGREE = 5,
    LITERAL = 6,
    CALL = 7,
    COLOR = 8,
    BINARY = 9,
}
export declare type CSSUnitType = "%" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "vh" | "vw" | "vmin";
export interface ICSSDeclValueExpressionVisitor {
    visitIdentifier(identifier: CSSDeclIdentifierExpression): any;
    visitSpaceList(spaceList: CSSDeclSpaceListExpression): any;
    visitCommaList(commaList: CSSDeclCommaListExpression): any;
    visitColor(color: CSSDeclColorExpression): any;
    visitDegree(degree: CSSDeclDegreeExpression): any;
    visitMeasurement(measurement: CSSDeclMeasurementExpression): any;
    visitCall(call: CSSDeclCallExpression): any;
    visitLiteral(string: CSSDeclLiteralExpression): any;
}
export declare abstract class CSSDeclValueExpression {
    readonly kind: CSSDeclValueExpressionKind;
    readonly location: ISourceLocation;
    constructor(kind: CSSDeclValueExpressionKind, location: ISourceLocation);
    abstract accept(visitor: ICSSDeclValueExpressionVisitor): any;
}
export declare class CSSDeclColorExpression extends CSSDeclValueExpression {
    readonly value: string;
    constructor(value: string, location: ISourceLocation);
    accept(visitor: ICSSDeclValueExpressionVisitor): any;
}
export declare class CSSDeclIdentifierExpression extends CSSDeclValueExpression {
    readonly value: string;
    constructor(value: string, location: ISourceLocation);
    accept(visitor: ICSSDeclValueExpressionVisitor): any;
    toString(): string;
}
export declare abstract class CSSDeclListExpression extends CSSDeclValueExpression {
    readonly items: CSSDeclValueExpression[];
    constructor(kind: CSSDeclValueExpressionKind, items: CSSDeclValueExpression[], location: ISourceLocation);
}
export declare class CSSDeclCommaListExpression extends CSSDeclListExpression {
    constructor(items: CSSDeclValueExpression[], location: ISourceLocation);
    accept(visitor: ICSSDeclValueExpressionVisitor): any;
}
export declare class CSSDeclSpaceListExpression extends CSSDeclListExpression {
    constructor(items: CSSDeclValueExpression[], location: ISourceLocation);
    accept(visitor: ICSSDeclValueExpressionVisitor): any;
}
export declare class CSSDeclMeasurementExpression extends CSSDeclValueExpression {
    readonly value: number;
    readonly unit: CSSUnitType;
    constructor(value: number, unit: CSSUnitType, location: ISourceLocation);
    accept(visitor: ICSSDeclValueExpressionVisitor): any;
}
export declare class CSSDeclDegreeExpression extends CSSDeclValueExpression {
    readonly value: number;
    constructor(value: number, location: ISourceLocation);
    accept(visitor: ICSSDeclValueExpressionVisitor): any;
}
export declare class CSSDeclLiteralExpression extends CSSDeclValueExpression {
    readonly value: string;
    constructor(value: string, location: ISourceLocation);
    accept(visitor: ICSSDeclValueExpressionVisitor): any;
}
export declare class CSSDeclCallExpression extends CSSDeclValueExpression {
    readonly identifier: CSSDeclValueExpression;
    readonly params: CSSDeclValueExpression[];
    constructor(identifier: CSSDeclValueExpression, params: CSSDeclValueExpression[], location: ISourceLocation);
    accept(visitor: ICSSDeclValueExpressionVisitor): any;
}
