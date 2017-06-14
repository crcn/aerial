// import { expect } from "chai";
// import { SyntheticBrowser, SyntheticHTMLElement } from "..";
// import { URIProtocolProvider, FileEditorProvider } from "@tandem/sandbox";
// import { generateRandomSyntheticHTMLElementSource } from "../test";
// import { Application, waitForPropertyChange, LogLevel } from "aerial-common";
// // import { createTestMasterApplication, createRandomFileName } from "@tandem/editor/test";

// describe(__filename + "#", () => {
//   let app: Application;
//   before(async () => {
//     app = createTestMasterApplication({
//       log: {
//         level: LogLevel.ERROR,
//       },
//       sandboxOptions: {
//         mockFiles: {}
//       }
//     });
//     await app.initialize();
//   });


//   const loadHTML = async (source: string) => {
//     const { kernel } = app;
//     const entryFilePath = createRandomFileName("html");
//     const protocol = URIProtocolProvider.lookup(entryFilePath, kernel);
//     await protocol.write(entryFilePath, `<div>${source}</div>`);

//     const browser = new SyntheticBrowser(kernel);
//     await browser.open({
//       uri: "file://" + entryFilePath
//     });

//     return {
//       entryFilePath: entryFilePath,
//       documentElement: browser.document.documentElement,
//       reloadDocumentElement: async () => {
//         await waitForPropertyChange(browser.sandbox, "exports");
//         return browser.document.documentElement;
//       }
//     };
//   };

//   const fuzzyCases = Array.from({ length: 30 }).map(() => {
//     return [generateRandomSyntheticHTMLElementSource(4, 3), generateRandomSyntheticHTMLElementSource(4, 3)];
//   });

//   [
//     [`<div id="a"></div>`, `<div id="b"></div>`],
//     [`<div id="a"></div>`, `<div></div>`],
//     [`<div></div>`, `<div id="b"></div>`],
//     [`<div id="a" class="b"></div>`, `<div class="c" id="a"></div>`],
//     [`<div>a</div>`, `<div>b</div>`],
//     [`<div>a</div>`, `<div><!--b--></div>`],
//     [`<div>a<!--b--><c /></div>`, `<div><!--b--><c />a</div>`],

//     // busted fuzzy tests
//     [
//       `<g a="gca" a="geab"></g>`,
//       `<g g="b" f="d"></g>`
//     ],

//     [
//       `<g b="ed" g="ad"></g>`,
//       `<g c="fad" g="fdbe" b="bdf"></g>`,
//     ],

//     // fuzzy
//     // ...fuzzyCases
//   ].forEach(([oldSource, newSource]) => {
//     it(`Can apply file edits from ${oldSource} to ${newSource}`, async () => {
//       const oldResult = await loadHTML(oldSource);
//       const newResult = await loadHTML(newSource);

//       expect(oldResult.documentElement.source).not.to.be.undefined;
//       const edit    = oldResult.documentElement.createEdit().fromDiff(newResult.documentElement);
//       expect(edit.mutations.length).not.to.equal(0);
//       await FileEditorProvider.getInstance(app.kernel).applyMutations(edit.mutations);
//       expect((await oldResult.reloadDocumentElement()).innerHTML.replace(/\n\s*/g, "")).to.equal(newResult.documentElement.innerHTML);
//     });
//   });
// });