import { expect } from "chai";
import { loadTestBrowser } from "../test";

describe(__filename + "#", () => {
  it("resolves urls from the css source file", async () => {

    const browser = await loadTestBrowser({
      "index.html": `
        <link rel="stylesheet" href="./assets/index.css" />
      `,
      "assets/index.css": `
        .container {
          background: url(test.png)
        }
      `,
      "assets/test.png": 'something'
    }, "file://index.html");

    expect(browser.document.styleSheets[0].cssText).equal(`.container {\n\tbackground: url("file://assets/test.png");\n}\n`);
  });

  it("resolves string urls from the css source file", async () => {

    const browser = await loadTestBrowser({
      "index.html": `
        <link rel="stylesheet" href="./assets/index.css" />
      `,
      "assets/index.css": `
        .container {
          background: url("test.png")
        }
      `,
      "assets/test.png": 'something'
    }, "file://index.html");

    expect(browser.document.styleSheets[0].cssText).equal(`.container {\n\tbackground: url("file://assets/test.png");\n}\n`);
  });
});

