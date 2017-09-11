// import fs =  require("fs");
// import path =  require("path");
// import { expect } from "chai";
// import { cssEditorTestCases } from "aerial-synthetic-browser/sandbox/css-editor-test";
// import { generateRandomStyleSheet } from "aerial-synthetic-browser/test/helpers";
// import { FileEditorProvider, URIProtocolProvider } from "aerial-sandbox";
// import { waitForPropertyChange, Application, LogLevel, serialize } from "aerial-common";
// import { createTestMasterApplication, createRandomFileName } from "@tandem/editor/test";
// import { SyntheticCSSStyleSheet, SyntheticBrowser, parseCSS, evaluateCSS } from "aerial-synthetic-browser";
// describe(__filename + "#", () => {
//   const cssLoaderPath = path.join(process.cwd(), "node_modules", "css-loader");
//   const addStylePath  = path.join(process.cwd(), "node_modules", "style-loader", "addStyles.js");
//   const cssBasePath   = path.join(cssLoaderPath, "lib", "css-base.js");
//   let app: Application;
//   before(async () => {
//     app = createTestMasterApplication({
//       log: {
//         level: LogLevel.NONE
//       },
//       sandboxOptions: {
//         mockFiles: {
//           [cssBasePath]: fs.readFileSync(cssBasePath, "utf8"),
//           [addStylePath]: fs.readFileSync(addStylePath, "utf8")
//         }
//       }
//     });
//     await app.initialize();
//   });
//   const loadCSS = async (content: string) => {
//     const { kernel } = app;
//     const entryCSSFilePath = createRandomFileName("scss");
//     const entryJSFilePath  = createRandomFileName("js");
//     const protocol = URIProtocolProvider.lookup(entryCSSFilePath, kernel);
//     await protocol.write(entryCSSFilePath, content);
//     await protocol.write(entryJSFilePath, `
//       require("${entryCSSFilePath}");
//     `);
//     const browser = new SyntheticBrowser(kernel);
//     await browser.open({
//       uri: entryJSFilePath,
//       dependencyGraphStrategyOptions: {
//         name: "webpack"
//       }
//     });
//     return {
//       styleSheet: browser.document.styleSheets[0],
//       fileEditor: FileEditorProvider.getInstance(kernel),
//       reloadStylesheet: async () => {
//         await waitForPropertyChange(browser.sandbox, "exports");
//         return browser.document.styleSheets[0]
//       }
//     }
//   }
//   const scssTestCases = [
//     // ...cssEditorTestCases,
//     [
//       `.a { .b { color: red }}`,
//       `.a { .b { color: green }}`,
//     ],
//     [
//       `.a { &-b { color: red }}`,
//       `.a { &-b { color: green }}`,
//     ],
//     [
//       `.a { &-b { color: red } &-c { color: green }}`,
//       `.a { &-b { color: blue } &-c { color: white }}`,
//     ],
//     [
//       `a { 
//         background: black; 
//         #header { 
//           color: red 
//         }
//       }`,
//       `a { 
//         background: black; 
//         #header {
//           color: blue 
//         }
//       }`,
//     ]
//   ];
//   [
//     // libscss is finicky with whitespace, so format the same tests
//     // again and ensure that they're editable
//     ...scssTestCases.map(([oldSource, newSource]) => {
//       return [
//         formatCSS(oldSource),
//         formatCSS(newSource)
//       ];
//     }),
//   ].forEach(([oldSource, newSource]) => {
//     // stubbed for now -- coupled with webpack
//     xit(`can apply a file edit from ${oldSource} to ${newSource}`, async () => {
//       const a = await loadCSS(oldSource);
//       const b = await loadCSS(newSource);
//       const edit = a.styleSheet.createEdit().fromDiff(b.styleSheet);
//       expect(edit.mutations.length).not.to.equal(0);
//       a.fileEditor.applyMutations(edit.mutations);
//       expect((await a.reloadStylesheet()).cssText).to.equal(b.styleSheet.cssText);
//     });
//   });
// });
// function formatCSS(source) {
//   return source.replace(/([;{}])/g, "$1\n");
// } 
//# sourceMappingURL=scss-editor-test.js.map