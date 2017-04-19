import { expect } from "chai";
import { LogLevel } from "@tandem/common";
import { SyntheticBrowser, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { createTestMasterApplication } from "@tandem/editor/test";
import { loadTestBrowser } from "@tandem/synthetic-browser/test";

// poorly organized DOM spec tests. TODO - move these into sep fiels
describe(__filename + "#", () => {

  it("Can dynamically create a new script", async () => {
    const { window } = await loadTestBrowser({
      "index.html": `
        <span>
        </span>
        <script>
          var script = document.createElement("script");
          script.text = "document.querySelector('span').appendChild(document.createTextNode('a'))";
          document.appendChild(script);
        </script>
      `
    }, "index.html");

    expect(window.document.querySelector("span").textContent).to.contain("a");
  });

  it("Can set the text of a script after it's been added to the DOM", async () => {
    const { window } = await loadTestBrowser({
      "index.html": `
        <span>
        </span>
        <script>
          var script = document.createElement("script");
          document.appendChild(script);
          script.text = "document.querySelector('span').appendChild(document.createTextNode('a'))";
        </script>
      `
    }, "index.html");

    expect(window.document.querySelector("span").textContent).to.contain("a");
  });

});