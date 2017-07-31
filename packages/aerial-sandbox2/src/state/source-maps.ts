export type SourcePosition2 = {
  line: number;
  column: number;
};

export type SourceLocation2 = {
  /**
   * The source AST expression kind.
   *
   * @type {*}
   */

  kind?: any;

  /**
   * Source file of the synthetic object expression.
   *
   * @type {string}
   */

  uri: string;
  start?: SourcePosition2;
  end?: SourcePosition2;
};