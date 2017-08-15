import { expect } from "chai";
import { serialize, deserialize } from "aerial-common";
import { generateRandomSyntheticHTMLElement } from "../test";
import { SyntheticWindow } from "..";

describe(__filename + "#", () => {
  // fuzzy
  it("can serialize & deserialize a random DOM node", () => {
    const window = new SyntheticWindow(null);
    const node = generateRandomSyntheticHTMLElement(window.document, 10, 5, 10, true);
    const data = serialize(node);
    const clone = deserialize(data, null);
    expect(node.toString()).to.equal(clone.toString());
  });
});