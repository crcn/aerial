import { BoundingRect } from "./bounding-rect";
export interface IRange {
  start: number;
  end: number;
}

export function cloneRange(range: IRange) {
  return { start: range.start, end: range.end };
}

export interface IPoint {
  left: number;
  top: number;
}


export class Point implements IPoint {
  constructor(public left: number, public top: number) {

  }
  clone() {
    return new Point(this.left, this.top);
  }
  distanceTo(point: Point) {
    return Math.sqrt(Math.pow(this.left - point.left, 2) + Math.pow(this.top - point.top, 2));
  }
}

export class Line {
  constructor(public from: Point, public to: Point) {

  }

  get points() {
    return [this.from, this.to];
  }

  flip() {
    return new Line(
      new Point(this.to.left, this.from.top),
      new Point(this.from.left, this.to.top)
    );
  }

  reverse() {
    return new Line(
      this.to.clone(),
      this.from.clone()
    );
  }

  get length() {
    return this.from.distanceTo(this.to);
  }

  getBoundingRect() {
    return new BoundingRect(
      Math.min(this.from.left, this.to.left),
      Math.min(this.from.top, this.to.top),
      Math.max(this.from.left, this.to.left),
      Math.max(this.from.top, this.to.top)
    );
  }
}