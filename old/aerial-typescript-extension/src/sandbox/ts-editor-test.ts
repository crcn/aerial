// import fs =  require("fs");
// import path =  require("path");
// import { expect } from "chai";
// const config = require(process.cwd() + "/webpack.config.js");
// import { waitForPropertyChange, Application, LogLevel } from "aerial-common";
// import { createTestMasterApplication, createRandomFileName } from "@tandem/editor/test";
// import { createTestSandboxProviders, ISandboxTestProviderOptions } from "aerial-sandbox/test";
// import { Sandbox, FileCacheProvider, URIProtocolProvider, FileEditorProvider } from "aerial-sandbox";

// import { SyntheticBrowser, SyntheticElement, evaluateMarkup } from "aerial-synthetic-browser";

// // TODO - move most of this in util functions - possibly in @tandem/editor/test/utils
// // TODO - re-use VM instead of creating a new one each time - should be much faster
// describe(__filename + "#", () => {

//   const aliases = Object.assign({}, config.resolve.alias, {
//     "react": process.cwd() + "/node_modules/react/dist/react.min.js",
//     "react-dom": process.cwd() + "/node_modules/react-dom/dist/react-dom.min.js"
//   });

//   const aliasMockFiles = {};

//   for (const name in aliases) {
//     const uri = aliases[name];
//     if (fs.existsSync(uri)) {
//       aliasMockFiles[name] = fs.readFileSync(uri, "utf8");
//     }
//   }


//   let app: Application;

//   before(async () => {
//     app = createTestMasterApplication({
//       log: {
//         level: LogLevel.NONE
//       },
//       sandboxOptions: {
//         mockFiles:aliasMockFiles
//       }
//     });
//     await app.initialize();
//   });

//   const loadJSX = async (jsx: string) => {
//     const { kernel } = app;

//     const entryFilePath = createRandomFileName("tsx");

//     await URIProtocolProvider.lookup(entryFilePath, kernel).write(entryFilePath, `
//       import React =  require("react");
//       import ReactDOM = require("react-dom");
//       const element = document.createElement("div");
//       ReactDOM.render(${jsx}, element);
//       exports.documentElement = element;
//     `);

//     const browser = new SyntheticBrowser(kernel);
//     await browser.open({
//       uri: entryFilePath,
//       dependencyGraphStrategyOptions: {
//         name: "webpack"
//       }
//     });

//     const getElement = () => {
//       return  browser.document.documentElement.firstChild as SyntheticElement;
//     }

//     return {
//       entryFilePath: entryFilePath,
//       element: getElement(),
//       editor: FileEditorProvider.getInstance(kernel),
//       fileCache: FileCacheProvider.getInstance(kernel),
//       reloadElement: async () => {
//         await waitForPropertyChange(browser.sandbox, "exports");
//         return getElement();
//       }
//     }
//   };

//   // testing to ensure the setup code above works
//   xit("can render an element", async () => {
//     const { element } = await loadJSX(`<div>a</div>`);
//     expect(element.textContent).to.equal("a");
//     expect(element.$source).not.to.be.undefined;
//     expect(element.$source.start).not.to.be.undefined;
//   });

//   [
//     // attribute editsw
//     [`<div id="a">Hello</div>`, `<div id="b">Hello</div>`],
//     [`<div>Hello</div>`, `<div id="b">Hello</div>`],
//     [`<div>Hello</div>`, `<div id="b">Hello</div>`],
//     [`<div id="a">Hello</div>`, `<div>Hello</div>`],
//     [`<div id="a" className="b">Hello</div>`, `<div title="c">Hello</div>`],
//     [`<div id="a" className="b" />`, `<div title="c" />`],

//     // container edits
//     [`<div></div>`, `<div>a</div>`],
//     [`<div><span>a</span></div>`, `<div>a</div>`],
//     [`<div><span>a</span><div>b</div></div>`, `<div><div>b</div><span>a</span></div>`],
//     [`<div />`, `<div>a</div>`],

//     [`(
//       <div />
//     )`, `<div>aa</div>`],

//     // add fuzzy here
//   ].reverse().forEach(([oldSource, newSource]) => {

//     // off for MVP
//     xit(`can apply typescript file edits from ${oldSource} to ${newSource}`, async () => {
//       const { element, editor, fileCache, entryFilePath, reloadElement } = await loadJSX(oldSource);
//       const newElementResult = await loadJSX(newSource);
//       const edit = element.createEdit().fromDiff(newElementResult.element);
//       expect(edit.mutations.length).not.to.equal(0);
//       editor.applyMutations(edit.mutations);
//       expect((await reloadElement()).outerHTML).to.equal(newElementResult.element.outerHTML);
//     });
//   });
// });