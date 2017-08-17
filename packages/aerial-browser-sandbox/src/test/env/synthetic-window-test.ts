import { expect } from "chai";
import { timeout } from "../utils";
import { diffWindow, patchWindow } from "../../environment";
import { waitForDocumentComplete, openTestWindow, stripWhitespace, wrapHTML } from "./utils";

describe(__filename + "#", () => {
  it("can open a simple page", async () => {
    const window = openTestWindow(wrapHTML(`Test`));

    await waitForDocumentComplete(window);

    const content = window.document.documentElement.outerHTML;
    expect(stripWhitespace(content)).to.eql(`<html><head></head><body>Test</body></html>`);
  });

  describe(`diff/patch#`, () => {
    const cases = [

      // basic DOM 
      [`a`, `b`, `c`],
      [`<!--a-->`, `<!--b-->`, `<!--c-->`],
      [`<h1></h1>`, `<h2></h2>`, `<h3></h3>`],
      [`<div a="b"></div>`, `<div a="c"></div>`],
      [`<div a="b" c="d"></div>`, `<div c="d"></div>`],
      [`<h2></h2><h1></h1>`, `<h1></h1><h2></h2>`],

      // basic CSS
      [`<style>.a { color: red; }</style>`, `<style>.a { color: blue; }</style>`]
    ];

    cases.forEach((variants) => {
      it(`can diff & patch ${variants.join(" -> ")}`, async () => {
        let mainWindow;
        for (const variant of variants) {
          const newWindow = openTestWindow(wrapHTML(variant));
          await waitForDocumentComplete(newWindow);
          if (mainWindow) {
            const diffs = diffWindow(mainWindow, newWindow);
            patchWindow(mainWindow, diffs);
            expect(mainWindow.document.body.innerHTML).to.eql(newWindow.document.body.innerHTML);
          } else {
            mainWindow = newWindow;
          }
        }
      });
    });
  });
});