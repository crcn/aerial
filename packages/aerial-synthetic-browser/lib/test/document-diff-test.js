// import { expect } from "chai";
// import { Mutation, serialize, deserialize } from "aerial-common";
// import { SyntheticObjectChangeWatcher, SyntheticObjectTreeEditor, URIProtocolProvider } from "aerial-sandbox";
// import { loadTestBrowser, timeout } from "../test";
// import { SyntheticCSSElementStyleRule, SyntheticDocument } from "..";
// describe(__filename + "#", () => {
//   [
//     [
//       { "index.html": `
//       <html lang="en">
//         <head>
//           <meta charset="utf-8">
//           <style>
//             html, body {
//               color: red;
//             }
//           </style>
//         </head>
//         <body>
//           Hola Mundo!!
//         </body>
//       </html>
//       ` },
//       { "index.html": `
//         <html lang="en">
//           <head>
//             <meta charset="utf-8">
//             <style>
//               html, body {
//                 color: red;
//               }
//             </style>
//             <style>
//               html, div {
//                 color: blue;
//               }
//             </style>
//           </head>
//           <body>
//             Hola Mundo!!
//           </body>
//         </html>
//       ` },
//       { "index.html": `
//       <html lang="en">
//         <head>
//           <meta charset="utf-8">
//           <style>
//             html, body {
//               color: red;
//             }
//           </style>
//         </head>
//         <body>
//           Hola Mundo!!
//         </body>
//       </html>
//       ` }
//     ],
//     [
//       { 
//         "index.html": `
//           <html lang="en">
//             <head>
//               <link rel="stylesheet" href="./index.css">
//               <meta charset="utf-8">
//               <style>
//                 html, body {
//                   color: red;
//                 }
//               </style>
//             </head>
//             <body>
//               Hola Mundo!!
//             </body>
//           </html>
//           `,
//         "index.css": `
//           html, body, span {
//             padding: 0;
//             margin: 0;
//             font-family: Helvetica;
//           }
//         `
//       },
//       { 
//         "index.html": `
//           <html lang="en">
//             <head>
//               <meta charset="utf-8">
//               <style>
//                 html, body {
//                   color: red;
//                 }
//               </style>
//             </head>
//             <body>
//               Hola Mundo!!
//             </body>
//           </html>
//           `
//       },
//       { 
//         "index.html": `
//           <html lang="en">
//             <head>
//               <link rel="stylesheet" href="./index.css">
//               <meta charset="utf-8">
//               <style>
//                 html, body {
//                   color: red;
//                 }
//               </style>
//             </head>
//             <body>
//               Hola Mundo!!
//             </body>
//           </html>
//           `
//       },
//     ]
//   ].forEach((changes) => {
//     it(`properly diffs ${JSON.stringify(changes)}`, async () => {
//       let clone: SyntheticDocument;    
//       const browser = await loadTestBrowser(changes.shift(), "index.html");
//       // simulate sending diff over the network
//       const watcher = new SyntheticObjectChangeWatcher<SyntheticDocument>((mutations:  Mutation<any>[]) => {
//         new SyntheticObjectTreeEditor(clone).applyMutations(mutations.map((mutation) => {
//           return deserialize(JSON.parse(JSON.stringify(serialize(mutation))), browser.kernel);
//         }));
//       }, (c) => {
//         clone = c.cloneNode(true);
//       });
//       const stringifyStyleSheets = (document: SyntheticDocument) => {
//         return document.styleSheets.map(ss => ss.cssText).join("");
//       }
//       const testClone = () => {
//         watcher.target = browser.document;
//         expect(browser.document.toString()).to.equal(clone.toString());
//         expect(stringifyStyleSheets(clone)).to.equal(stringifyStyleSheets(browser.document));
//       }
//       testClone();
//       while (changes.length) {
//         const fileChanges = changes.shift() as any;
//         for (const fileName in fileChanges) {
//           await URIProtocolProvider.lookup(fileName, browser.kernel).write(fileName, fileChanges[fileName]);
//         }
//         await timeout();
//         testClone();
//       }
//     });
//   })
// });
//# sourceMappingURL=document-diff-test.js.map