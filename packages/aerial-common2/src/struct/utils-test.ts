import { expect } from "chai";
import { identity } from "lodash";
import { typed, idd } from "./utils";

describe(__filename + "#", () => {
  describe("typed#", () => {
    it("can make a typed struct factory", () => {
      const createShape = typed("shape", identity);
      const shape = createShape({ a: "b" });
      expect(shape.$$type).to.eql("shape");
    });
  });

  describe("idd#", () => {
    it("can make an id'd structure", () => {
      const createShape = idd(identity as (({a: number}) => {a: number}));
      const s1 = createShape({ a: 1 });
      const s2 = createShape({ a: 1 });
      expect(s1.$$id).to.eql("1");
      expect(s1.a).to.eql(1);
    });

  });
});