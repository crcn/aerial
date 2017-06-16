// import { expect } from "chai";
// import { FileEditorProvider } from "aerial-sandbox";
// import { SyntheticCSSStyleRule } from "aerial-synthetic-browser";
// import { loadTestBrowser, timeout } from "aerial-synthetic-browser/test";
// import { PrivateBusProvider, LogLevel } from "aerial-common";

// // TODO - media queries, keyframes 
// describe(__filename + "#", () => {
//   xit("Can returns the proper line & column information for style sheets in style elements", async () => {
//     const { kernel, window } = await loadTestBrowser({
//       "index.html": `
//         <style>
//           .container {
//             color: red;
//           }
//         </style>
//       `
//     }, "index.html");

//     const styleSheet = window.document.styleSheets[0];
//     expect(styleSheet.$source.start.line).to.equal(3);
//     expect(styleSheet.$source.start.column).to.equal(11);
//   });

//   it("Can edit a simple style rule", async () => {
//     const browser = await loadTestBrowser({
//       "index.html": `
//         <style>
//           .container {
//             color: red;
//           }
//         </style>
//       `
//     }, "index.html");

  
//     const styleSheet = browser.window.document.styleSheets[0];
//     const rule = styleSheet.rules[0] as SyntheticCSSStyleRule;
//     const edit = rule.createEdit();
//     edit.setDeclaration("color", "blue");

//     await FileEditorProvider.getInstance(browser.kernel).applyMutations(edit.mutations);
//     await timeout();

//     expect(browser.window.document.styleSheets[0].cssText).to.equal(`.container {\n\tcolor: blue;\n}\n`);
//   });

//   it("Maps urls to their full path", async () => {
//     const browser = await loadTestBrowser({
//       "index.html": `
//         <style>
//           .container {
//             color: red;
//             background: url(test.png);
//           }
//         </style>
//       `,
//       "test.png": `something`
//     }, "index.html");

  
//     const styleSheet = browser.window.document.styleSheets[0];
//     const rule = styleSheet.rules[0] as SyntheticCSSStyleRule;
//     expect(rule.style.background).to.equal(`url("file://test.png")`);
//   });

//   [
//     [
//       `@media screen {
//         .container {
//           color: red
//         }
//       }`
//     ],
//     [
//       `@keyframes test {
//         0%, 2% {
//           color: red
//         }
//       }`
//     ]
//   ].forEach(([input, output]) => {
//     it(`Can parse ${input}`, async () => {
      

//       // just this for now -- need to ensure that the style element parses css content properly
//       // since it uses source maps
//       const browser = await loadTestBrowser({
//         "index.html": `
//           <style>
//             ${input}
//           </style>
//         `
//       }, "index.html");

    
//     });
//   })
// });