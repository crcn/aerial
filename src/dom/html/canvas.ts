// import Canvas = require("canvas-prebuilt");
import { SyntheticHTMLElement } from "./element";

export class SyntheticHTMLCanvasElement extends SyntheticHTMLElement {
  private _canvas: any; // HTMLCanvasElement

  createdCallback() {
    super.createdCallback();

    // default
    this._canvas = {};
  }

  get height() {
    return this._canvas.height;
  }

  set height(value: number) {
    this._canvas.height = value;
  }

  msToBlob() {
    return null;
  }

  toDataURL(type?: string, ...args: any[]): string {
    return this._canvas.toDataURL(type, ...args);
  }

  toBlob(callback: (result: Blob | null) => void, type?: string, ...args: any[]): void {

  }

  get width() {
    return this._canvas.width;
  }

  set width(value: number) {
    this._canvas.width = value;
  }

  // getContext(contextId: "2d", contextAttributes?: Canvas2DContextAttributes): CanvasRenderingContext2D | null;
  // getContext(contextId: "webgl" | "experimental-webgl", contextAttributes?: WebGLContextAttributes): WebGLRenderingContext | null;

  getContext(contextId: string, contextAttributes?: any) {
    // return this._canvas.getContext(contextId, contextAttributes);
    // stub for now
    return {
      clearRect() { },
      canvas: { width: 500, height: 500 },
      arc() { },
      closePath() { },
      fill() { },
      beginPath() { }
    };
  }
}