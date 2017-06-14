import { ISourceLocation } from "aerial-common";

// https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
export enum CSSMediaExpressionKind {
  MEDIA_QUERY_LIST = 1,
  MEDIA_QUERY      = MEDIA_QUERY_LIST + 1,
  FEATURE          = MEDIA_QUERY + 1,
}

export type MediaType = "all"|"aural"|"braille"|"handheld"|"print"|"projection"|"screen"|"tty"|"tv"|"embossed"|"speech";
export type MediaFeatureType = "width"|"min-width"|"max-width"|"height"|"min-height"|"max-height"|"aspect-ratio"|"min-aspect-ratio"|"max-aspect-ratio"|"color"|"min-color"|"max-color"|"color-indent"|"min-color-index"|"max-color-index"|"monochrome"|"min-monochrome"|"max-monochrome"|"resolution"|"min-resolution"|"max-resolution"|"scan"|"grid";

export interface ICSSMediaExpressionVisitor {
  visitMediaQueryList(expression: CSSMediaQueryListExpression);
  visitMediaQuery(expression: CSSMediaQueryExpression);
  visitMediaFeature(expression: CSSMediaFeatureExpression);
}

export abstract class CSSMediaExpression {
  constructor(readonly kind: CSSMediaExpressionKind, readonly location: ISourceLocation) {

  }
  abstract accept(visitor: ICSSMediaExpressionVisitor);
}

export class CSSMediaQueryListExpression extends CSSMediaExpression {
  constructor(readonly items: CSSMediaQueryExpression[], location: ISourceLocation) {
    super(CSSMediaExpressionKind.MEDIA_QUERY_LIST, location);
  }
  accept(visitor: ICSSMediaExpressionVisitor) {
    visitor.visitMediaQueryList(this);
  }
}

export class CSSMediaQueryExpression extends CSSMediaExpression {
  constructor(readonly operator: "only"|"not", readonly type: MediaType, readonly features: CSSMediaFeatureExpression[], location: ISourceLocation) {
    super(CSSMediaExpressionKind.MEDIA_QUERY, location);
  }
  accept(visitor: ICSSMediaExpressionVisitor) {
    visitor.visitMediaQuery(this);
  }
}

export class CSSMediaFeatureExpression extends CSSMediaExpression {
  constructor(readonly name: MediaFeatureType, readonly value: string, location: ISourceLocation) {
    super(CSSMediaExpressionKind.FEATURE, location);
  }
  accept(visitor: ICSSMediaExpressionVisitor) {
    visitor.visitMediaFeature(this);
  }
}