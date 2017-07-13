import {expect} from "chai";
import {
  weakMemo,
} from "./index";

describe(__filename + "#", () => {
  describe("weakMemo#", () => {
    it("can memoize a function with an object that's already been processed", () => {
      let calls = 0;
      const mfn = weakMemo(({count}) => {
        calls++;
        return count + 1;
      });
      const obj = { count: 1 };
      expect(mfn(obj)).to.eql(2);
      expect(mfn(obj)).to.eql(2);
      expect(calls).to.eql(1);
    });

    it("does not memoize two different objects that share the same shape", () => {
      let calls = 0;
      const mfn = weakMemo(({count}) => {
        calls++;
        return count + 1;
      });
      const obj = { count: 1 };
      expect(mfn({ count: 1 })).to.eql(2);
      expect(mfn({ count: 1 })).to.eql(2);
      expect(calls).to.eql(2);
    });

    it("can take multiple arguments", () => {
      let calls = 0;
      const add = weakMemo((a, b) => {
        calls++;
        return a.count + b.count;
      });

      const a = { count: 1 };
      const b = { count: 2 };
      expect(add(a, b)).to.eql(3);
      expect(add(a, b)).to.eql(3);
      expect(calls).to.eql(1);
    });

  });
});