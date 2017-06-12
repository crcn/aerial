import { IPoint } from "./base";

export class Transform {

  constructor(public left: number = 0, public top: number = 0, public scale: number = 1) {

  }

  localizePosition(position: IPoint) {
    return {
      left: (position.left - this.left) / this.scale,
      top: (position.top - this.top) / this.scale
    };
  }
}