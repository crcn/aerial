import { expect } from "chai";
import { LogLevel } from "@tandem/common";
import { SyntheticBrowser, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { createTestMasterApplication } from "@tandem/editor/test";
import { loadTestBrowser } from "@tandem/synthetic-browser/test";

// poorly organized DOM spec tests. TODO - move these into sep fiels
describe(__filename + "#", () => {

  it("Returns null if getItem doesn't exist", async () => {
    const { window } = await loadTestBrowser({
      "index.html": `
        <span>
        </span>
        <script>

          // null is parsable by JSON.parse -- this provides another safety check
          document.querySelector("span").appendChild(document.createTextNode(JSON.parse(localStorage.getItem("not found")) === null))
        </script>
      `
    }, "index.html");

    expect(window.document.querySelector("span").textContent).to.contain("true");
  });


});