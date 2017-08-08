import { stripWhitespace, openTestWindow, waitForDocumentComplete } from "./utils";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can query for one element", async () => {
    const window = openTestWindow(`<span>a</span><div>b</div><span>c</span>`);
    await waitForDocumentComplete(window);
    expect(
      stripWhitespace(
        window.document.querySelector("span").innerHTML
      )
    ).to.eql("a");
  });

  it("can query for multiple elements", async () => {
    const window = openTestWindow(`<span>a</span><div>b</div><span>c</span>`);
    await waitForDocumentComplete(window);
    expect(
      stripWhitespace(
        window.document.querySelector("span").innerHTML
      )
    ).to.eql("a");
  });
}); 
