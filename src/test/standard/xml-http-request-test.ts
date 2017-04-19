import { expect } from "chai";
import { loadTestBrowser } from "@tandem/synthetic-browser/test";

describe(__filename + "#", () => {
  it("XMLHttpRequest exists", async () => {
    const { window } = await loadTestBrowser({
      "index.js": `
        document.body.appendChild(document.createTextNode(typeof XMLHttpRequest))
      `
    }, "index.js");

    expect(window.document.textContent).to.equal("function");
  });
  
});