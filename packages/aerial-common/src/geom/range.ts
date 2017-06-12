import { IRange } from "./base";

export class Range {
  constructor(public start: number, public end: number) { }
  shift(delta: number) {
    this.start += delta;
    this.end   += delta;
  }
}