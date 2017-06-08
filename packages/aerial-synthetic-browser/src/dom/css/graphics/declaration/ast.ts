import { ISourceLocation } from "@tandem/common";

export enum CSSDeclValueExpressionKind {
  IDENTIFIER  = 1,
  COMMA_LIST  = IDENTIFIER + 1,
  SPACE_LIST  = COMMA_LIST + 1,
  MEASUREMENT = SPACE_LIST + 1,
  DEGREE      = MEASUREMENT + 1,
  LITERAL     = DEGREE + 1,
  CALL        = LITERAL + 1,
  COLOR       = CALL + 1,
  BINARY      = COLOR + 1
}

export type CSSUnitType = "%"|"cm"|"em"|"ex"|"in"|"mm"|"pc"|"pt"|"px"|"vh"|"vw"|"vmin";


export interface ICSSDeclValueExpressionVisitor {
  visitIdentifier(identifier: CSSDeclIdentifierExpression);
  visitSpaceList(spaceList: CSSDeclSpaceListExpression);
  visitCommaList(commaList: CSSDeclCommaListExpression);
  visitColor(color: CSSDeclColorExpression);
  visitDegree(degree: CSSDeclDegreeExpression);
  visitMeasurement(measurement: CSSDeclMeasurementExpression);
  visitCall(call: CSSDeclCallExpression);
  visitLiteral(string: CSSDeclLiteralExpression);
}

export abstract class CSSDeclValueExpression {
  constructor(readonly kind: CSSDeclValueExpressionKind, readonly location: ISourceLocation) {

  }
  abstract accept(visitor: ICSSDeclValueExpressionVisitor);
}

export class CSSDeclColorExpression extends CSSDeclValueExpression {
  constructor(readonly value: string, location: ISourceLocation) {
    super(CSSDeclValueExpressionKind.COLOR, location);
  }
  accept(visitor: ICSSDeclValueExpressionVisitor) {
    return visitor.visitColor(this);
  }
}

export class CSSDeclIdentifierExpression extends CSSDeclValueExpression {
  constructor(readonly value: string, location: ISourceLocation) {
    super(CSSDeclValueExpressionKind.IDENTIFIER, location);
  }
  accept(visitor: ICSSDeclValueExpressionVisitor) {
    return visitor.visitIdentifier(this);
  }
  toString() {
    return this.value;
  }
}

export abstract class CSSDeclListExpression extends CSSDeclValueExpression {
  constructor(kind: CSSDeclValueExpressionKind, readonly items: CSSDeclValueExpression[], location: ISourceLocation) {
    super(kind, location);
  }
}

export class CSSDeclCommaListExpression extends CSSDeclListExpression {
  constructor(items: CSSDeclValueExpression[], location: ISourceLocation) {
    super(CSSDeclValueExpressionKind.COMMA_LIST, items, location);
  }
  accept(visitor: ICSSDeclValueExpressionVisitor) {
    return visitor.visitCommaList(this);
  }
}

export class CSSDeclSpaceListExpression extends CSSDeclListExpression {
  constructor(items: CSSDeclValueExpression[], location: ISourceLocation) {
    super(CSSDeclValueExpressionKind.SPACE_LIST, items, location);
  }
  accept(visitor: ICSSDeclValueExpressionVisitor) {
    return visitor.visitSpaceList(this);
  }
}

export class CSSDeclMeasurementExpression extends CSSDeclValueExpression {
  constructor(readonly value: number, readonly unit: CSSUnitType, location: ISourceLocation) {
    super(CSSDeclValueExpressionKind.MEASUREMENT, location);
  }
  accept(visitor: ICSSDeclValueExpressionVisitor) {
    return visitor.visitMeasurement(this);
  }
}

export class CSSDeclDegreeExpression extends CSSDeclValueExpression {
  constructor(readonly value: number, location: ISourceLocation){
    super(CSSDeclValueExpressionKind.DEGREE, location);
  }
  accept(visitor: ICSSDeclValueExpressionVisitor) {
    return visitor.visitDegree(this);
  }
}

export class CSSDeclLiteralExpression extends CSSDeclValueExpression {
  constructor(readonly value: string, location: ISourceLocation){
    super(CSSDeclValueExpressionKind.LITERAL, location);
  }
  accept(visitor: ICSSDeclValueExpressionVisitor) {
    return visitor.visitLiteral(this);
  }
}

export class CSSDeclCallExpression extends CSSDeclValueExpression {
  constructor(readonly identifier: CSSDeclValueExpression, readonly params: CSSDeclValueExpression[], location: ISourceLocation) {
    super(CSSDeclValueExpressionKind.CALL, location);
  }
  accept(visitor: ICSSDeclValueExpressionVisitor) {
    return visitor.visitCall(this);
  }
}