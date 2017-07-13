import {expect} from "chai";
import {
  immutable, 
  mutable, 
  weakMemo,
  mapImmutable,
  ImmutableArray, 
  ImmutableObject,
} from "./index";

describe(__filename + "#", () => {
  describe("immutable#", () => {
    it("can convert a simple object into an ImmutableObject", () => {
      expect(immutable({})).to.be.an.instanceof(ImmutableObject);
    });

    it("can convert a simple object with props into an ImmutableObject", () => {
      const obj = immutable({ a: "b" });
      expect(obj).to.be.an.instanceof(ImmutableObject);
      expect(obj.a).to.eql("b");
    });

    it("can convert a simple array to an ImmutableArray", () => {
      const obj = immutable([]);
      expect(obj).to.be.an.instanceof(ImmutableArray);
    });

    it("can convert a simple array with values to an ImmutableArray", () => {
      const obj = immutable([{a: "b"}]);
      expect(obj).to.be.an.instanceof(ImmutableArray);
      expect(obj[0]).to.be.an.instanceof(ImmutableObject);
    });

    it("can convert a small nested object into an immutable one", () => {
      const obj = immutable([{a: { b: "c" }}]);
      expect(obj).to.be.an.instanceof(ImmutableArray);
      expect(obj[0]).to.be.an.instanceof(ImmutableObject);
      expect(obj[0].a).to.be.an.instanceof(ImmutableObject);
      expect(obj[0].a.b).to.eql("c");
    });
  });

  describe("mutable#", () => {
    it("can convert an ImmutableObject into a mutable one", () => {
      const obj = mutable(immutable({}));
      obj.a = "b";
      expect(obj.a).to.be.eql("b");
    });

    it("can convert an ImmutableArray", () => {
      const obj = mutable(immutable([{ a: "b" }]));
      obj[1] = 1;
      expect(obj.length).to.eql(2);
      obj[0].c = "d";
      expect(obj[0].c).to.eql("d");
    });

    it("can convert a nested immutable object into a mutable one", () => {
      const obj = mutable(immutable([{ a: { b: "c" } }]));
      obj[1] = 1;
      obj[0].b = "d";
      expect(obj[0].b).to.eql("d");
    });
  });

  describe("mapImmutable#", () => {
    it("can map a simple object to another", () => {
      const obj = mapImmutable(immutable({ a: "b" }), { a: "c" });
      expect(obj.a).to.eql("c");
    });

    mapImmutable({ name: 'string' }, a => ({ name: 'jeff' }));

    it("can map an immutable array", () => {
      const obj = mapImmutable(immutable([1, 2, 3, 4]), v => v.filter(v => v !== 3));
      expect(obj.length).to.eql(3);
    });

    it("can map an immutable array's value based on an object", () => {
      const target = immutable([1, 2, 3]);

      const result = mapImmutable(target, { [target.indexOf(2)]: v => v * 10 });
      expect(result.length).to.eql(3);
      expect(result[1]).to.eql(20);
    });
  });

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