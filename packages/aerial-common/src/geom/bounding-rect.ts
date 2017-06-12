import { IPoint } from "@tandem/common/geom";
import { serializable } from "../serialize";

@serializable("BoundingRect", {
  serialize({ left, top, right, bottom }: BoundingRect) {
    return [left, top, right, bottom ];
  },
  deserialize([ left, top, right, bottom ]) {
    return new BoundingRect(left, top, right, bottom);
  }
})
export class BoundingRect {

  constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) { }

  get position(): IPoint {
    return {
      left: this.left,
      top: this.top
    };
  }

  get width() {
    return Math.max(this.right - this.left, 0);
  }

  set width(value) {
    this.right = this.left + value;
  }

  get height() {
    return Math.max(this.bottom - this.top, 0);
  }

  set height(value) {
    this.bottom = this.top + value;
  }

  zoom(delta: number) {
    return new BoundingRect(
      this.left * delta,
      this.top * delta,
      this.right * delta,
      this.bottom * delta
    );
  }

  equalTo(rect: BoundingRect) {
    return (
      this.left === rect.left &&
      this.top === rect.top &&
      this.right === rect.right &&
      this.bottom === rect.bottom
    );
  }

  get visible() {
    return this.width > 0 && this.height > 0;
  }

  toArray() {
    return [this.left, this.top, this.right, this.bottom];
  }

  intersects(...rects: BoundingRect[]): boolean {
    return !!rects.find((rect) => (
      this.intersectsHorizontal(rect) &&
      this.intersectsVertical(rect)
    ));
  }

  intersectsHorizontal(...rects: BoundingRect[]): boolean {
    return !!rects.find((rect) => (
      Math.max(this.top, rect.top) <= Math.min(this.bottom, rect.bottom)
    ));
  }

  intersectsVertical(...rects: BoundingRect[]): boolean {
    return !!rects.find((rect) => (
      Math.max(this.left, rect.left) <= Math.min(this.right, rect.right)
    ));
  }

  merge(...rects: Array<BoundingRect>): BoundingRect {
    return BoundingRect.merge(this, ...rects);
  }

  move({ left, top }: IPoint): BoundingRect {
    return new BoundingRect(
      this.left + left,
      this.top   + top,
      this.right + left,
      this.bottom + top
    );
  }

  moveTo({ left, top }: IPoint): BoundingRect {
    return new BoundingRect(
      left,
      top,
      left + this.width,
      top + this.height
    );
  }

  clone(): BoundingRect {
    return new BoundingRect(this.left, this.top, this.right, this.bottom);
  }

  static fromClientRect(rect: ClientRect) {
    return new BoundingRect(rect.left, rect.top, rect.right, rect.bottom);
  }

  static zeros() {
    return new BoundingRect(0, 0, 0, 0);
  }

  static merge(...rects: Array<BoundingRect>): BoundingRect {
    let left   = Infinity;
    let bottom = -Infinity;
    let top    = Infinity;
    let right  = -Infinity;

    for (const rect of rects) {
      left   = Math.min(left, rect.left);
      right  = Math.max(right, rect.right);
      top    = Math.min(top, rect.top);
      bottom = Math.max(bottom, rect.bottom);
    }

    return new BoundingRect(left, top, right, bottom);
  }
}
