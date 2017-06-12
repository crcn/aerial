export class Token {
  readonly length: number;
  constructor(readonly value: string, readonly type: string) {
    this.length = value.length;
  }
}