import {expect} from "chai";
import {ImmutableArray, createImmutableArray} from "./array";

describe(__filename + "#", () => {
  it("can be created without values", () => {
    const array = createImmutableArray();
    expect(array).to.be.an.instanceof(ImmutableArray);
    expect(array).to.be.an.instanceof(Array);
  });

  it("cannot define a property in the immutable array", () => {
    const array = createImmutableArray(1, 2, 3)
    try {
      array[0] = 2;
    } catch(e) {
      expect(e.message).to.contain(`Cannot assign to read only property`);
    }
    expect(array[0]).to.equal(1);
  });

  it('can set an index value with set()', () => {
    const array = createImmutableArray(1, 2, 3);
    const newArray = array.set(0, 4);
    expect(array === newArray).to.eql(false);
    expect(newArray[0]).to.eql(4);
    expect(array[0]).to.eql(1);
  });

  describe("native array compliance#", () => {
    it("can be merged to an existing array via concat()", () => {
      const array = [].concat(createImmutableArray(0, 1, 2));
      expect(array instanceof ImmutableArray).to.eql(false);
      expect(array.length).to.equal(3);
    });

    it("can be spread to a new array", () => {
      const items = [...createImmutableArray(1, 2, 3)];
      expect(items.length).to.eql(3);
    });
  });
});