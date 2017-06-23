import {expect} from "chai";
import {immutable, mergeImmutable, ImmutableArray, ImmutableObject} from "./index";

describe(__filename + "#", () => {
  describe("immutable#", () => {
    it("can convert a simple object into an ImmutableObject", () => {
      expect(immutable({})).to.be.an.instanceof(ImmutableObject);
    });

    it("can convert a simple object with props into an ImmutableObject", () => {
      const obj = immutable({ a: 'b' });
      expect(obj).to.be.an.instanceof(ImmutableObject);
      expect(obj.a).to.eql('b');
    });

    it("can convert a simple array to an ImmutableArray", () => {
      const obj = immutable([]);
      expect(obj).to.be.an.instanceof(ImmutableArray);
    });

    it("can convert a simple array with values to an ImmutableArray", () => {
      const obj = immutable([{a: 'b'}]);
      expect(obj).to.be.an.instanceof(ImmutableArray);
      expect(obj[0]).to.be.an.instanceof(ImmutableObject);
    });

    it("can convert a small nested object into an immutable one", () => {
      const obj = immutable([{a: { b: 'c' }}]);
      expect(obj).to.be.an.instanceof(ImmutableArray);
      expect(obj[0]).to.be.an.instanceof(ImmutableObject);
      expect(obj[0].a).to.be.an.instanceof(ImmutableObject);
      expect(obj[0].a.b).to.eql('c');
    });
  });
});