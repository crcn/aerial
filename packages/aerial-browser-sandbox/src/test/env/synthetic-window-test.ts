import { expect } from "chai";
import { timeout } from "../utils";
import { waitForDocumentComplete, openTestWindow, stripWhitespace, wrapHTML } from "./utils";

describe(__filename + "#", () => {
  it("can open a simple page", async () => {
    const window = openTestWindow(wrapHTML(`Test`));

    await waitForDocumentComplete(window);

    const content = window.document.documentElement.outerHTML;
    expect(stripWhitespace(content)).to.eql(`<html><head></head><body>Test</body></html>`);
  })
});