
export class StringScanner {

  private _source: string;
  private _position: number;
  private _capture: any;

  constructor(source) {
    this._source   = source == null ? "" : String(source);
    this._position = 0;
  }

  scan(regexp) {
    const rest = this._source.substr(this._position);
    const match = rest.match(regexp);
    if (!match) return void 0;
    this._capture = match[0];
    this._position += rest.indexOf(this._capture) + this._capture.length;
    return this._capture;
  }

  nextChar() {
    return this._source.charAt(this._position++);
  }

  hasTerminated() {
    return this._position >= this._source.length;
  }

  getCapture() {
    return this._capture;
  }
}
