import { expect } from "chai";
import { serialize, deserialize } from "@tandem/common";
import { generateRandomSyntheticHTMLElement } from "../test/helpers";
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