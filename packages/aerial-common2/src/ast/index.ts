export type ExpressionPosition = {
  line: number;
  column: number;
};

export type ExpressionLocation = {
  uri: string;

  // the expression kind - attr element name, text, comment, etc.
  kind?: any;

  // start of the expression
  start?: ExpressionPosition;

  // end of the xpressions
  end?: ExpressionPosition;
};

export function expressionPositionEquals(a: ExpressionPosition, b: ExpressionPosition) {
  return (a == null && b == null) || (a && b && (a.line === b.line && a.column === b.column));
}

export function expressionLocationEquals(a: ExpressionLocation, b: ExpressionLocation) {
  return (a == null && b == null) || (a && b && a.kind === b.kind && a.uri === b.uri && expressionPositionEquals(a.start, b.start) && expressionPositionEquals(a.end, b.end))
}