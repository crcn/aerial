import {expect} from "chai";
import {immutable, mutable, updateImmutable, ImmutableArray, ImmutableObject} from "./index";

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

  describe("mergeImmutable#", () => {
    it("can merge two objects together", () => {
      const obj = updateImmutable({ a: 'b' }, { a: 'c' });
      expect(obj.a).to.eql('c');
    });
    
    it("can merge two immutable objects together", () => {
      const oldValue = immutable({ a: 'b' });
      const obj = updateImmutable(oldValue, immutable({ a: 'c' }));
      expect(obj.a).to.eql('c');
      expect(obj === oldValue).to.eql(false);
    });

    it("can merge two arrays together", () => {
      const obj = updateImmutable([7, 6, 8], [1, 2, 3, 4, 5, 6]);
      expect(obj.length).to.eql(6);
    });

    it("can merge two arrays together with objects", () => {
      const obj = updateImmutable([{ a: 1 }, { b: 2 }], [{ a: 3 }, { b:  4 }]);
      expect(mutable(obj)).to.eql([{ a: 3 }, { b:  4 }]); 
      expect(obj[0].$$immutable).to.eql(true);
    });

    it("can merge a nested object", () => {
      interface IPerson {
        name: string;
        friends?: IPerson[];
      }

      const obj = updateImmutable<IPerson>({
        name: 'jeff',
        friends: [
          { name: 'jake' }
        ]
      }, { 
        $set: {
          name: 'a',
          friends: [
            {  },
            { name: 'jeremy' }
          ]
        }
      });

      expect(obj.friends.length).to.eql(2);
      expect(obj.name).to.eql('jeff');
    });
  });
});