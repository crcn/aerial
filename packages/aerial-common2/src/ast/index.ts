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