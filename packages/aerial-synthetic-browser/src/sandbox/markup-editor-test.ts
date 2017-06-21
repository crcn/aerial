import { expect } from "chai";
import { SyntheticBrowser, SyntheticHTMLElement } from "..";
import { URIProtocolProvider, FileEditorProvider } from "aerial-sandbox";
import { generateRandomSyntheticHTMLElementSource, createTestKernel, createRandomFileName } from "../test";
import { Application, waitForPropertyChange, LogLevel, Kernel, serialize } from "aerial-common";
// import { createTestMasterApplication, createRandomFileName } from "@tandem/editor/test";

describe(__filename + "#", () => {
  let kernel: Kernel;
  before(async () => {
    kernel = createTestKernel({
      log: {
        level: LogLevel.ERROR,
      },
      sandboxOptions: {
        mockFiles: {}
      }
    });
  });


  const loadHTML = async (source: string) => {
    const entryFilePath = createRandomFileName("html");
    const protocol = URIProtocolProvider.lookup(entryFilePath, kernel);
    await protocol.write(entryFilePath, `<div>${source}</div>`);

    const browser = new SyntheticBrowser(kernel);
    await browser.open({
      uri: "file://" + entryFilePath
    });

    return {
      entryFilePath: entryFilePath,
      documentElement: browser.document.documentElement,
      reloadDocumentElement: async () => {
        await waitForPropertyChange(browser.sandbox, "exports");
        return browser.document.documentElement;
      }
    };
  };

  const fuzzyCases = Array.from({ length: 30 }).map(() => {
    return [generateRandomSyntheticHTMLElementSource(4, 3), generateRandomSyntheticHTMLElementSource(4, 3)];
  });

  [
    [`<div id="a"></div>`, `<div id="b"></div>`],
    [`<div id="a"></div>`, `<div></div>`],
    [`<div></div>`, `<div id="b"></div>`],
    [`<div id="a" class="b"></div>`, `<div class="c" id="a"></div>`],
    [`<div>a</div>`, `<div>b</div>`],
    [`<div>a</div>`, `<div><!--b--></div>`],
    [`<div>a<!--b--><c /></div>`, `<div><!--b--><c />a</div>`],

    [
      `<g a="gca" a="geab"></g>`,
      `<g g="b" f="d"></g>`
    ],

    [
      `<g b="ed" g="ad"></g>`,
      `<g c="fad" g="fdbe" b="bdf"></g>`,
    ],

    [
      `<l>gb</l>`,
      `<l><g></g>afc</l>`
    ]

    // fuzzy
    // ...fuzzyCases
  ].forEach(([oldSource, newSource]) => {
    it(`Can apply file edits from ${oldSource} to ${newSource}`, async () => {
      const oldResult = await loadHTML(oldSource);
      const newResult = await loadHTML(newSource);

      expect(oldResult.documentElement.source).not.to.be.undefined;
      const edit    = oldResult.documentElement.createEdit().fromDiff(newResult.documentElement);
      expect(edit.mutations.length).not.to.equal(0);
      oldResult.documentElement
      const element = oldResult.documentElement.clone(true);
      edit.applyMutationsTo(element);
      await FileEditorProvider.getInstance(kernel).applyMutations(edit.mutations);
      expect((await oldResult.reloadDocumentElement()).innerHTML.replace(/\n\s*/g, "")).to.equal(newResult.documentElement.innerHTML);
    });
  });
});